import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import PageTitle from './components/PageTitle';
import faqQuestions from '../data/faqQuestions.json';

interface Question {
  question: string;
  answer: string;
}

const questions: Question[] = [
  { question: "Why can't I access the general info link?", answer: "You need to be signed into your MVLA account!" },
  { question: "Where do I need to look for more information about setting up labs?", answer: "Check out the general info website to get answers about that and a lot more!" },
  {question: "Uh oh... I got an error! What do I do?", answer: "Email us at {info to be filled in}"}
];



const FAQ = () => {
  return (
    <>
      <NavBar />
      <PageTitle title="FAQ" />
      <div style={{ height: "78vh" }}>
        {/* DEBUG: find anohte way to make footer sticky to the bottomm */}
        <Grid container spacing={2} style={{maxWidth: "175vh", margin: '0 auto', padding: '20px' }}>
          {/* {questions.map((value, index) => ( */}
            {/* // <Grid item xs={12} md={6} key={index}> */}
              
                {Object.entries(faqQuestions).map(([key, value]) => (
                  <>
                    {console.log(key)}
                    <Grid item xs={12} md={6} key={key}>
                    <Accordion key={key}>
                    <AccordionSummary key={key} expandIcon={<ExpandMoreIcon />}>
                    <Typography>{value.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{value.answer}</Typography>
                      </AccordionDetails>
                      </Accordion>
                      </Grid>
                    </>
                    
                ))}
                
                  
              
              {/* </Accordion> */}
            {/* </Grid> */}
          {/* ))} */}
          </Grid>
        </div>
      <Footer />
    </>
  );
};

export default FAQ;
