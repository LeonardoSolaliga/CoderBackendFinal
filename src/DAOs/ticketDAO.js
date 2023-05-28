import ticketModel from "../Model/ticket.js";

export default class TicketsDao{
    getTickets=()=>{
        return ticketModel.find().lean
    }
    getTicketById=(params)=>{
        return ticketModel.findOne(params).lean
    }
    createTicket=ticket=>{
        return ticketModel.create(ticket)
    }
}