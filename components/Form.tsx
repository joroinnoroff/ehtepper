import { motion } from 'framer-motion';
import { ArrowLeft, BookOpenIcon, Building2, Clock, Clock5, Mail, MessageCircle, Phone, PhoneCall, User, User2Icon } from 'lucide-react';

import React, { useState } from 'react';
import toast from 'react-hot-toast';


const Turoptions = [
  { id: 1, label: 'Privat', group10: 1500, group25: 2500 },
  { id: 2, label: 'Bedrift', group10: 1500, group25: 2500 },
  { id: 3, label: 'Utdanningsinstitusjon', group10: 1000, group25: 1000 },
];

const Form = () => {
  const [gruppetur, setGruppetur] = useState<number | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [ehf, setEhf] = useState<boolean>(false);
  const [formdata, setFormData] = useState({
    userName: '',
    email: '',
    phone: '',
    gruppetur: '',
    date: '',
    time: '',
    companyName: '',
    department: '',
    orgNumber: '',
    userMessage: '',
  });
  const [moreMessage, setMoreMessage] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const selectedOption = Turoptions.find((option) => option.id === selectedOptionId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formdata.userName === '' ||
      formdata.email === '' ||
      formdata.phone === '' ||
      gruppetur === null ||
      formdata.date === '' ||
      formdata.time === ''
    ) {
      toast.error('Fyll inn alle feltene');
      return;
    }

    try {
      const res = await fetch('/api/mailOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formdata,
          gruppetur,
          selectedOption,
        }),
      });

      if (res.ok) {
        toast.success('Din bestilling er sendt');
        setShowSummary(true);
        setFormData({
          userName: '',
          email: '',
          phone: '',
          gruppetur: '',
          date: '',
          time: '',
          companyName: '',
          department: '',
          orgNumber: '',
          userMessage: '',
        });
      } else {
        toast.error('Noe gikk galt');
      }
    } catch (error) {
      toast.error('Noe gikk galt, prøv igjen senere');
    }
  };

  return (
    <div className="w-full h-full my-20 flex items-center">
      <div className="wrapper flex flex-col lg:flex-row gap-2">


        <div className="right w-auto min-h-full">
          <h1 className="text-8xl tracking-widest w-full text-center my-4">Get in touch</h1>


          <p className="text-xl my-5 xl:w-3/4 text-center m-auto font-thin  ">
            Normal response time is 1-3 buisness days.
          </p>

          <form onSubmit={handleSubmit} className="text-center max-w-xl mx-auto  ">
            <div className='flex flex-col my-4 text-lg relative'>

              <div className="relative my-2">
                <input
                  required value={formdata.userName} onChange={(e) => setFormData({ ...formdata, userName: e.target.value })}
                  type="text" id='Kontaktpers' placeholder='First and last name'
                  className="pl-10 pr-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-0"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User2Icon strokeWidth={1.25} />
                </div>
              </div>

              <div className="relative my-2">
                <input
                  required value={formdata.userName} onChange={(e) => setFormData({ ...formdata, userName: e.target.value })}
                  type="text" id='Subject' placeholder='Subject'
                  className="pl-10 pr-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-0"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpenIcon strokeWidth={1.25} color='#ccc' />
                </div>
              </div>

              <div className="relative w-full h-52 border rounded-lg">
                <textarea name="" id="" className="w-full h-full p-3 focus:outline-none focus:ring-0 bg-transparent" placeholder='Write your message here...'></textarea>

              </div>
            </div>




            <button type='submit' className='text-2xl tracking-wide hover:text-purple-100 transition-all will-change-transform'>Send it</button>

          </form>
        </div>
      </div >
    </div >
  );
}

export default Form