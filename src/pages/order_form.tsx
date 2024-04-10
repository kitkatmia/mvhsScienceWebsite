import React, {useState} from 'react'
import { useOrderContext } from './contexts/OrderContext';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { format } from 'date-fns';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import PageTitle from './components/PageTitle';

interface StateType {
  answerType: string,
  question: string,
  options: string[] | undefined
}

enum answerTypes {
  multiSelect = "multi-select",
  date = "date",
  multiPeriodAutofill = "multi-period-autofill",
  textField = "text-field"
}

const OrderForm = () => {
  const { sharedState } = useOrderContext();
  var arr: StateType[] = [];
  var questions: string = sharedState[1] ? sharedState[1] : "{}";
    Object.keys(JSON.parse(questions)).forEach(function(key) {
      arr.push(JSON.parse(questions)[key]);
    });
  var title: string = sharedState[0] ? sharedState[0]+" Order Form" : "Order form";

  const [period, setPeriod] = useState('');
  const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPeriod(event.target.value);
  };

  const [multiSelect, setMultiSelect] = useState('');
  const handleMultiSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMultiSelect(event.target.value);
  };


  // this should be part of autofill
  const periodArr = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
  ];

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [textFieldValue, setTextFieldValue] = useState('');

  // test
  const [textFieldResponses, setTextFieldResponses] = useState({"":""});
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
  // TODO - json.parse; custom components bsed on Q info
  return (
    <>
      <NavBar />
      <PageTitle title={title} />
      <div className='flex justify-center py-4'>
      {Object.keys(arr).length === 0 ? (
        <div>Sorry, the form timed out. Please navigate back to order, and complete the form in one go to avoid this issue.</div>
      ) : (
        <div className="flex flex-col space-y-4">
            {arr.map(item => {
              switch (item.answerType) {
                case (answerTypes.multiPeriodAutofill): {
                  return (
                    <div >
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
                  <>
                    <FormLabel id="demo-controlled-radio-buttons-group">{item.question}</FormLabel>
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      footer={dateFooter}
                    />
                  </>
                  )
                }
                case (answerTypes.multiSelect): {
                  return (
                    <div >
                      <FormControl>
                          <FormLabel id="demo-controlled-radio-buttons-group">{item.question}</FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={multiSelect}
                          onChange={handleMultiSelectChange}
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
                  <div key={item.question} className="flex flex-col">
                    <FormLabel id="demo-text-field" className="pb-2">{item.question}</FormLabel>
                    <TextField
                      id="outlined-basic"
                      label="Ex: 2 hours, maybe 3"
                      variant="outlined"
                      // brlow doesn't work bc of type issues
                      // value={(item.question in textFieldResponses) ? textFieldResponses[item.question] : ''}
                      // work-around
                      value={(item.question as keyof typeof textFieldResponses) in textFieldResponses ? textFieldResponses[item.question as keyof typeof textFieldResponses] : ''}
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
              default:
                return null;
                
            }
            })}
            <Button variant="contained" color="success" endIcon={<SendIcon />} className="py-2 my-4">
              Submit
            </Button>
          </div>
      )}
      </div>
      <Footer/>
      {/* {Object.keys(JSON.parse(sharedState))} */}
    </>
  )
}

export default OrderForm