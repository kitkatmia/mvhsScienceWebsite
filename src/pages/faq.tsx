import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Question {
  question: string;
  answer: string;
}

const questions: Question[] = [
  { question: "Why can't I access the general info link?", answer: "You need to be signed into your MVLA account!" },
  { question: "Where do I need to look for more information about setting up labs?", answer: "Check out the general info website to get answers about that and a lot more!"}
];

const FAQ = () => {
  return (
    <>
      <NavBar/>
        <div>This is where the faq will be</div>
        {questions.map((value, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {value.question}
            </AccordionSummary>
            <AccordionDetails>
              {value.answer}
            </AccordionDetails>
          </Accordion>
        ))}
      <Footer/>
    </>
  );
};

export default FAQ;
