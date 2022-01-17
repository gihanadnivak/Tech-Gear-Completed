import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import EditQuestion from './EditQuestion';
import { Modal } from 'react-responsive-modal';
import 'react-accessible-accordion/dist/fancy-example.css';
import 'react-responsive-modal/styles.css';
import AnswerQuestion from './AnswerQuestion';
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/dist/sweetalert2.css';
import { useSnackbar } from 'notistack';
import {CSVLink} from "react-csv";

export const popularFaqnew = [
    {
        "question": "What are the return guidelines? ",
        "answer": "Your address and the item that you wish to return must be eligible for return.If the return is not eligible for Pickup, a Self-Return option will be given.Once the return is received, you will, in accordance with Tech Gear Refund Policy, be issued a refund to your original payment method.",
        "topic": "I want to return an Item",
        "state": "Answered",
        "date": "Sat Oct 9 2021 11:30:30 GMT+0530 (India Standard Time)",
        "category": "Store"
    },
    {
        "question": "I want to report a customer service complaint for the tech store. Who do I contact?",
        "answer": "You can Contact  Tech Store manager using contact us page.",
        "topic": "I have bad experience with your store",
        "state": "Answered",
        "date": "Fri Oct 08 2021 10:46:53 GMT+0530 (India Standard Time)",
        "category": "Other"
    },
    {
        "question": "What is the educational discount for the Tech Store??",
        "answer": "Academic discounts up to 85% are available on some items. Please visit the techstore website or the store itself for more details..",
        "topic": "I want to have a Students discount",
        "state": "Answered",
        "date": "Fri Oct 08 2021 09:46:15 GMT+0530 (India Standard Time)",
        "category": "Products"
    },
    {
        "question": "Do you provide any offers when perchasing a product ?",
        "answer": "Yes of course. We are offering in seasoning times ",
        "topic": "installment offers ?",
        "state": "Answered",
        "date": "Fri Oct 08 2021 09:46:15 GMT+0530 (India Standard Time)",
        "category": "Payment"
    },
    {
        "question": "Can I buy products whthout registering to the webiste ?",
        "answer": "No you cann't. It is compulsary to register to ou website.",
        "topic": "Buy products",
        "state": "Answered",
        "date": "Fri Oct 08 2021 04:43:11 GMT+0530 (India Standard Time)",
        "category": "Store"
    },
    {
        "question": "Are there any installments available for a purchase ?",
        "answer": "Sorry , There are no installments available for our website.",
        "topic": "Paying fees",
        "state": "Answered",
        "date": "Sun Oct 10 2021 07:46:53 GMT+0530 (India Standard Time)",
        "category": "Payment"
    },
    {
        "question": "How long it takes to diliver the product ?",
        "answer": " It depent on your product size.If the package is small it will diliver to you within two days.If the package is larger it will take more than 5 days.",
        "topic": "Product dilevery",
        "state": "Answered",
        "date": "Sun Oct 10 2021 19:46:15 GMT+0530 (India Standard Time)",
        "category": "Dilevery"
    },
    {
        "question": "How can I track my products ?",
        "answer": "You can track your Item with the tracking details provided by our dilevery team.",
        "topic": "Asking about Tracking details",
        "state": "Answered",
        "date": "Sun Oct 10 2021 15:46:15 GMT+0530 (India Standard Time)",
        "category": "Payment"
    },
    {
        "question": "Do you have any offers in special seasons ?",
        "answer": "Yse we have.",
        "topic": "Asking about apecial offers ",
        "state": "Answered",
        "date": "Sun Oct 10 2021 12:46:15 GMT+0530 (India Standard Time)",
        "category": "Payment"
    }
    
];

 const headers = [
     {label: 'Question' , key: 'question'},
     {label: 'Answer' , key: 'answer'},
     {label: 'Topic' , key: 'topic'},
     {label: 'State' , key: 'state'},
     {label: 'Date' , key: 'date'},
     {label: 'Category' , key: 'category'}
     
 ]

 const csvREport = {
     filename: 'Report.csv',
     headers: headers,
     data: popularFaqnew
 };

 ///////////////////////// function/////////////////////////////////

function FAQPage(props) {

    const [selectedQuestion, setSelectedQuestion] = useState({})
    const [faqs, setFaqs] = useState([])
    const { enqueueSnackbar } = useSnackbar();

    //Edit Modal
    const [editId, setEditId] = useState("");
    const [editModalOpen, setEditModalOpen] = useState(false);
    const onOpenEditModal = () => setEditModalOpen(true);
    const onCloseEditModal = () => setEditModalOpen(false);

    //Answer Modal
    const [answerId, setAnswerId] = useState("");
    const [answerModalOpen, setAnswerModalOpen] = useState(false);
    const onOpenAnswerModal = () => setAnswerModalOpen(true);
    const onCloseAnswerModal = () => setAnswerModalOpen(false);

    const answerQuestion = (e) => {
        setAnswerId(e.target.id);
        findSelectedRow(e.target.id, "answer");
        onOpenAnswerModal();
    }
    const editQuestion = (e) => {
        console.log(e.target.id)
        findSelectedRow(e.target.id, "edit");
        onOpenEditModal();
    }

    //for answerd questions
    const findSelectedRow = (id, type) => {
        console.log(id)
        if (type === "edit") {
            faqs.filter(element => element.state === "answered").map(question => {
                if (question._id === id.split("-")[1].toString()) {
                    setSelectedQuestion(question)
                    return;
                }
            })
        } else {
            faqs.filter(element => element.state === "pending").map(question => {
                if (question._id === id.split("-")[1].toString()) {
                    setSelectedQuestion(question)
                    return;
                }
            })
        }

    }

    const deleteQuestion = (e) => {
        console.log(e.target.id)
        if (e.target.id !== "") {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this after deleting!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it'
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete("/api/faq/delete", {
                        data: { id: (e.target.id).split("-")[1].toString() }
                    }).then(response => {
                        if (response.data.status === "success") {
                            enqueueSnackbar("Successfully Deleted", {
                                variant: 'success',
                                autoHideDuration: 3000,
                            });
                            getQuestions()
                        }
                    })
                }
            })
        }
    }

    //for getting qurstions
    const getQuestions = () => {
        axios.get("/api/faq/get")
            .then(response => {
                setFaqs(response.data.data)
            }).catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        getQuestions();
    }, [])

    return (
        <div>
            <section className="hero is-warning">
                <div className="hero-body pb-3 pt-5">
                    <div className="columns">
                        <div className="column is-10">
                            <p className="title">
                                FAQ Management
                            </p>
                            <p className="subtitle">
                                Admin  FAQ
                            </p>
                        </div>
                        <div className="column is-2">
                            <img className="hero-image" src="https://image.flaticon.com/icons/png/512/1321/1321740.png" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="searchbar mt-5">
                <div className="field has-addons">
                    
                    </div>
                <button className="btn btn-info text-warning"> <CSVLink data={popularFaqnew} >Genarate Report</CSVLink>  </button>
                
            </div>

            <section className="mt-5">
                <div className="columns">
                    <div className="column is-6 has-text-centered">

                        {/* ANSWERED */}
                        <h1 className="title is-4">Answered</h1>
                        <Accordion>
                            {
                                faqs.filter(element => element.state === "answered").map((faq, key) => {
                                    return (
                                        <AccordionItem key={key}>
                                            <AccordionItemHeading>
                                                <AccordionItemButton>
                                                    {faq.question}
                                                </AccordionItemButton>
                                            </AccordionItemHeading>
                                            <AccordionItemPanel>
                                                <div className="tags mb-1">
                                                    <span className="tag is-link">{faq.category}</span>
                                                    <span className="tag is-warning">{faq.topic}</span>
                                                </div>
                                                <p className="has-text-justified" id={"qab-" + faq._id}>
                                                    {faq.answer}
                                                </p>
                                                <div className="has-text-centered mt-3">
                                                    <div className="buttons has-text-centered">
                                                        <button className="button is-success is-small" id={"qe-" + faq._id} onClick={editQuestion}>Edit</button>
                                                        <button className="button is-danger is-small" id={"qd-" + faq._id} onClick={deleteQuestion}>Delete</button>
                                                    </div>
                                                </div>
                                            </AccordionItemPanel>
                                        </AccordionItem>
                                    )
                                })
                            }
                        </Accordion>
                        <Modal className="is-fullwidth" open={editModalOpen} onClose={onCloseEditModal} center>
                             {/* Render Edit Question Page */}
                            <EditQuestion selectedQuestion={selectedQuestion} closeEditModal={onCloseEditModal} getQuestions={getQuestions} />
                        </Modal>
                    </div>
                    <div className="column is-6 has-text-centered">

                        {/* not answered */}
                        <h1 className="title is-4">Need To Respond</h1>
                        <Accordion>
                            {
                                faqs.filter(element => element.state === "pending").map((faq, key) => {
                                    return (
                                        <AccordionItem key={key}>
                                            <AccordionItemHeading>
                                                <AccordionItemButton>
                                                    {faq.question}
                                                </AccordionItemButton>
                                            </AccordionItemHeading>
                                            <AccordionItemPanel>
                                                <div className="has-text-centered">
                                                    <div className="buttons has-text-centered">
                                                        <button className="button is-success is-small" id={"qa-" + faq._id} onClick={answerQuestion}>Answer</button>
                                                        <button className="button is-danger is-small" id={"qd-" + faq._id} onClick={deleteQuestion}>Delete</button>
                                                    </div>
                                                </div>
                                            </AccordionItemPanel>
                                        </AccordionItem>
                                    )
                                })
                            }
                        </Accordion>
                        <Modal open={answerModalOpen} onClose={onCloseAnswerModal} center>
                            {/* Render Answer question Component */}
                            <AnswerQuestion selectedQuestion={selectedQuestion} closeEditModal={onCloseAnswerModal} getQuestions={getQuestions} />
                        </Modal>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default FAQPage;