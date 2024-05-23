import React, {CSSProperties, useState} from 'react'
import { useOrderContext } from '../contexts/OrderContext';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import { format, min } from 'date-fns';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import PageTitle from './components/PageTitle';

import { Status } from '@prisma/client'
import { api } from '~/utils/api'
import { useSession } from 'next-auth/react';

const statusMap: Record<Status, string> = {
  Complete: "Complete",
  Not_Started: "Not Started",
  In_Progress: "In Progress",
};

interface StateType {
  answerType: string,
  question: string,
  options: string[] | undefined
  type: string | undefined
}

enum answerTypes {
  multiSelect = "multi-select",
  date = "date",
  multiPeriodAutofill = "multi-period-autofill",
  textField = "text-field",
  autoMultiSelect = "auto-multi-select"
}

type DictTypeResponse = Record<string, string>;
type Question = Record<string, StateType>;

const OrderForm = () => {
  const mutation = api.order.createOrder.useMutation();
  const userQuery = api.user.getUserInfo.useQuery();
  // const userLocation = userQuery.data?.school;

  const { data: session } = useSession();
  const { sharedState } = useOrderContext();
  const arr: StateType[] = [];
  const questionTypeCount: Record<string, number> = {};
  const questions: string = sharedState[1] ? sharedState[1] : "{}";
  const parsedQuestions: Question = JSON.parse(questions) as Question;
  Object.keys(parsedQuestions).forEach(function (key) {
    const item = parsedQuestions[key];
    if (item !== undefined) {
      arr.push(item);
    } else {
      console.error("Unexpected undefined value at : ", key);
    }
    if (key in Object.keys(questionTypeCount)) {
      if (questionTypeCount[key] != undefined) {
        questionTypeCount[key] += 1;
      }
    } else {
      questionTypeCount[key] = 1;
    }
  });
  const title: string = sharedState[0] ? sharedState[0] + " Order Form" : "Order form";

  const [period, setPeriod] = useState('');
  const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPeriod(event.target.value);
  };

  // this should be part of autofill
  const periodArr: { value: string, label: string }[] = [];
  for (let i = 1; i <= 7; i++) {
      periodArr.push({ value: `${i}`, label: `${i}` });
  }

  const [selectedDate, setSelectedDate] = useState<Date>();

  const [multiSelectResponses, setMultiSelectResponses] = useState<DictTypeResponse>({ "": "" });
  const handleMultiSelectResponsesChange = (questionId: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMultiSelectResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: event.target.value,
    }));
  };

  const [textFieldResponses, setTextFieldResponses] = useState<DictTypeResponse>({ "": "" });
  const handleTextFieldResponsesChange = (questionId: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextFieldResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: event.target.value,
    }));
  };


  let dateFooter = <p>Please pick a day.</p>;
  if (selectedDate) {
    dateFooter = <p>You picked {format(selectedDate, 'PP')}.</p>;
  }
      
  const isComplete = () => {
    let complete = true;
    Object.keys(questionTypeCount).forEach(key => {
      // need below line or will get error: two values in this comparison do not have a shared enum type
      const type = key as answerTypes;
      if (type === answerTypes.multiSelect && questionTypeCount[type] !== Object.keys(multiSelectResponses).length) {
        complete = false;
      } else if (type === answerTypes.date && !selectedDate) {
        complete = false;
      } else if (type === answerTypes.multiPeriodAutofill && period === '') {
        complete = false;
      } else if (type === answerTypes.textField && questionTypeCount[type] !== Object.keys(textFieldResponses).length) {
        complete = false;
      }
    });
    return complete;
  }

  const getUserDbOptions = (type: string | undefined): string[] => {
    if (typeof type === "undefined"){
      console.log("uh oh... something is wrong...");
      return [""];
    }
    try {
      if (type === "room" && typeof userQuery.data?.rooms === "string") {
        // need as string[] so it doesn't complain about unsafe return
        return JSON.parse(userQuery.data.rooms) as string[];
      } else if (type === "class" && typeof userQuery.data?.subjects === "string") {
        return JSON.parse(userQuery.data.subjects) as string[];
      } else if (type === "school" && typeof userQuery.data?.school === "string") {
        return [userQuery.data.school] as string[];
      }
    } catch (error) {
      console.error("Failed to parse JSON", error);
    }
    return [""];
  }

  const handleSubmit = () => {
    if (isComplete()) {
      // DEBUG: this is a hacky solution, but it prevents undefined errors if {"": ""} not present
      if (Object.keys(multiSelectResponses).length > 1) {
        delete multiSelectResponses[""]
      }
      
      if (Object.keys(textFieldResponses).length > 1) {
        delete textFieldResponses[""]
      }

      // const personLocation = session?.use
      const period_with_colon = period + ":";
      const orderDetails = {
        userId: session?.user?.id ?? "",
        status: Status.Not_Started,
        categories: title,
        description: "n/a",
        details: JSON.stringify({
          ...(Object.keys(textFieldResponses).length > 0 && {multiSelectResponses: multiSelectResponses}),
          ...(Object.keys(textFieldResponses).length > 0 && {textFieldResponses: textFieldResponses}),
          ...(period_with_colon !== ":" && {period_with_colon: period_with_colon}),
          ...(selectedDate && { date: format(selectedDate, 'yyyy-MM-dd') }),
        })
      };
      mutation.mutate(orderDetails, {
        onSuccess: (data) => {
          console.log('Order created successfully!', data);
        },
        onError: (error) => {
          console.error('Failed to create order', error);
        }
      });
    } else {
      console.log('incomplete form');
    }
  }

  // copying google forms to make format look a little nicer
  const regComponentDivStyle = {
    backgroundColor: '#fff', 
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '20px',
    marginBottom: '10px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const centeredComponentDivStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: '#fff', 
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '20px',
    marginBottom: '10px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };
  
  const overallDivStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr', 
    gap: '10px', 
    maxWidth: 'max(90vw, 100vw - 30px)',
    marginLeft: 'auto',
    marginRight: 'auto',
  };
  if (userQuery.isLoading) {
    return (
      <>
        <NavBar />
        <PageTitle title={title} />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '75vh',
          flexDirection: 'column',
          rowGap: '2vh'
        }}>
          <CircularProgress />
          {"Note: if this loading process takes more than a few minutes, something is wrong. Try restarting the form."}
        </div>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <PageTitle title={title} />
      <div className='flex justify-center py-4'>
        {Object.keys(arr).length === 0 ? (
          <div>Sorry, the form timed out. Please navigate back to order, and complete the form in one go to avoid this issue.</div>
        ) : (
          <div style={overallDivStyle}>
            {arr.map((item, index) => {
              switch (item.answerType) {
                case (answerTypes.multiPeriodAutofill): {
                  return (
                    <div key={index} style={regComponentDivStyle}>
                      <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">{item.question}</FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={period}
                          onChange={handlePeriodChange}
                        >
                          {periodArr.map((option) => (
                            <FormControlLabel
                              key={option.value}
                              value={option.value}
                              control={<Radio />}
                              label={option.label}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </div>
                  )
                }
                case (answerTypes.date): {
                  return (
                      // regularly don't need cssproperties, but flexdirection causes an error without it -> see https://github.com/cssinjs/jss/issues/1344
                    <div key={index} style={centeredComponentDivStyle as CSSProperties}>
                      <FormLabel id={`date-picker`}>{item.question}</FormLabel>
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        footer={dateFooter}
                      />
                    </div>
                  )
                }
                case (answerTypes.multiSelect): {
                  return (
                    <div key={index} style={regComponentDivStyle}>
                      <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">{item.question}</FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={item.question in multiSelectResponses ? multiSelectResponses[item.question] : ''}
                          onChange={(event) => handleMultiSelectResponsesChange(item.question, event)}
                        >
                          {item.options?.map((option) => (
                            <FormControlLabel
                              key={option}
                              value={option}
                              control={<Radio />}
                              label={option}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </div>
                  )
                }
                case answerTypes.textField:
                  return (
                    <div key={index} className="flex flex-col" style={regComponentDivStyle}>
                      <FormLabel id="demo-text-field" className="pb-2">{item.question}</FormLabel>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        value={(item.question) in textFieldResponses ? textFieldResponses[item.question] : ''}
                        onChange={(event) => handleTextFieldResponsesChange(item.question, event)}
                      />
                    </div>
                    // <div key={item.question} className="flex flex-col">
                    //   <FormLabel id="demo-text-field" className="pb-2">{item.question}</FormLabel>
                    //   <TextField
                    //     id="outlined-basic"
                    //     label="Ex: 2 hours, maybe 3"
                    //     variant="outlined"
                    //     value={textFieldValue}
                    //     onChange={(event) => setTextFieldValue(event.target.value)}
                    //   />
                    // </div>
                  );
                case (answerTypes.autoMultiSelect): {
                  const options = getUserDbOptions(item.type);
                  return (
                    <div key={index} style={regComponentDivStyle}>
                      <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group">{item.question}</FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={options.length === 1 ? options[0] : ((item.question) in multiSelectResponses ? multiSelectResponses[item.question] : '')}
                          onChange={(event) => handleMultiSelectResponsesChange(item.question, event)}
                        >
                          {options?.map((option: string) => (
                            <FormControlLabel
                              key={option}
                              value={option}
                              control={<Radio />}
                              label={option}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </div>
                  )
                }
                default:
                  return null;
              
              }
            })}
            <Button component="a" href="/order_status" variant="contained" color="success" endIcon={<SendIcon />} className="py-2 my-4" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}


export default OrderForm