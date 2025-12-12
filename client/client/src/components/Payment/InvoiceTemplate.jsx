import React, { useRef } from 'react';
import { Printer, Download, MapPin, Phone, Mail } from 'lucide-react';
import Button from '../UI/Button';
import { format } from 'date-fns';

const InvoiceTemplate = ({ invoiceData }) => {
  const printRef = useRef();

  // Mock data agar props na aayen (Safety ke liye)
  const data = invoiceData || {
    invoiceNumber: 'INV-2025-001',
    date: new Date(),
    dueDate: new Date(),
    status: 'PAID',
    guest: {
      name: 'John Doe',
      email: 'john@example.com',
      address: '123 Guest Street, NY'
    },
    items: [
      { description: 'Deluxe Room (3 Nights)', quantity: 3, unitPrice: 200, total: 600 },
      { description: 'Room Service - Dinner', quantity: 1, unitPrice: 50, total: 50 },
      { description: 'Laundry Service', quantity: 2, unitPrice: 15, total: 30 },
    ],
    subtotal: 680,
    tax: 68,
    total: 748,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      
      {/* Actions Bar (Print ke waqt chhup jayega) */}
      <div className="flex justify-end gap-3 mb-6 print:hidden">
        <Button variant="outline" onClick={handlePrint}>
          <Printer size={18} className="mr-2" />
          Print Invoice
        </Button>
        <Button variant="primary">
          <Download size={18} className="mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Main Invoice Sheet (A4 size look) */}
      <div 
        ref={printRef}
        className="bg-white p-8 md:p-12 shadow-xl print:shadow-none print:w-full print:m-0 print:p-0 text-gray-800"
        style={{ minHeight: '297mm' }} // A4 Height approx
      >
        
        {/* Header Section */}
        <div className="flex justify-between items-start border-b-2 border-primary pb-8 mb-8">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary text-white flex items-center justify-center font-bold text-xl rounded">LS</div>
              <h1 className="text-2xl font-bold tracking-wide text-primary">LuxuryStay</h1>
            </div>
            
            {/* Hotel Address */}
            <div className="text-sm text-gray-500 space-y-1">
              <p className="flex items-center gap-2"><MapPin size={14}/> 123 Luxury Ave, Beverly Hills</p>
              <p className="flex items-center gap-2"><Phone size={14}/> +1 (800) 123-4567</p>
              <p className="flex items-center gap-2"><Mail size={14}/> billing@luxurystay.com</p>
            </div>
          </div>

          <div className="text-right">
            <h2 className="text-4xl font-light text-gray-300 mb-2">INVOICE</h2>
            <p className="font-semibold text-gray-700"># {data.invoiceNumber}</p>
            
            {/* Payment Status Badge */}
            <div className={`mt-2 inline-block px-3 py-1 text-xs font-bold border rounded uppercase
              ${data.status === 'PAID' ? 'text-green-600 border-green-600 bg-green-50' : 'text-red-600 border-red-600 bg-red-50' }
            `}>
              {data.status}
            </div>
          </div>
        </div>

        {/* Bill To & Dates */}
        <div className="flex justify-between mb-10">
          <div className="w-1/2">
            <h3 className="text-gray-500 text-xs font-bold uppercase mb-2">Bill To:</h3>
            <p className="font-bold text-lg">{data.guest.name}</p>
            <p className="text-gray-600 text-sm">{data.guest.email}</p>
            <p className="text-gray-600 text-sm max-w-xs">{data.guest.address}</p>
          </div>
          <div className="text-right">
            <div className="mb-2">
              <span className="text-gray-500 text-xs font-bold uppercase mr-4">Invoice Date:</span>
              <span className="font-medium">{format(data.date, 'dd MMM, yyyy')}</span>
            </div>
            <div>
              <span className="text-gray-500 text-xs font-bold uppercase mr-4">Due Date:</span>
              <span className="font-medium">{format(data.dueDate, 'dd MMM, yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-50 border-y border-gray-200">
              <th className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase">Description</th>
              <th className="py-3 px-4 text-center text-xs font-bold text-gray-500 uppercase">Qty / Nights</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-gray-500 uppercase">Unit Price</th>
              <th className="py-3 px-4 text-right text-xs font-bold text-gray-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-4 px-4 text-sm font-medium text-gray-800">{item.description}</td>
                <td className="py-4 px-4 text-center text-sm text-gray-600">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-sm text-gray-600">${item.unitPrice.toFixed(2)}</td>
                <td className="py-4 px-4 text-right text-sm font-semibold text-gray-800">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end mb-12">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (10%)</span>
              <span>${data.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-primary border-t border-gray-300 pt-3">
              <span>Total</span>
              <span>${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Terms */}
        <div className="border-t border-gray-200 pt-8 text-sm text-gray-500">
          <h4 className="font-bold text-gray-700 mb-2">Terms & Conditions</h4>
          <p>Payment is due within 15 days. Thank you for choosing LuxuryStay Hospitality. We hope to see you again soon.</p>
        </div>

      </div>
    </div>
  );
};

export default InvoiceTemplate;