import React from 'react'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';

interface Question {
  question: string;
  answer: string;
}

const questions: Question[] = [
    { question: "Why can't I access the general info link?", answer: "You need to be signed into your MVLA account!" },
    { question: "Where do I need to look for more information about setting up labs?", answer: "Check out the general info website to get answers about that and a lot more!"}
]

const FAQ = () => {
    return (
      <>
        <NavBar/>
            <div>This is where the faq will be</div>
            <AccordionGroup>
                {/* <Accordion> */}
                {questions.map(value => {
                            return <Accordion>
                                <AccordionSummary>{value.question}</AccordionSummary>
                                <AccordionDetails>{value.answer}</AccordionDetails>
                            </Accordion>
                })}
                {/* <AccordionSummary>Title</AccordionSummary>
                <AccordionDetails>Content</AccordionDetails> */}
            {/* </Accordion> */}
            </AccordionGroup>
        <Footer/>
    </>
  )
}

export default FAQ