import React, { useEffect, useState } from 'react';
import img1 from '../assets/allLogos/customer-top.png';
import RivewCard from './RivewCard';
const CustomerReview = () => {
    const[reviews,setReviews]=useState([]);

    useEffect(()=>{
        fetch('/customerRivew.json')
        .then(res=>res.json())
        .then(data=>{
            setReviews(data);
            // console.log(data);
        });
    },[])
    return (
        <div>
            <div className='flex flex-col gap-4 items-center mt-20'>
                <img src={img1} alt="customer top png" />
            <h1 className='text-3xl font-bold'>What our customers are sayings</h1>
            <p className='text-sm'>Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!</p>
            </div>
            <div>
                {
                    reviews.map((singleRev)=>(
                        <RivewCard singleRev={singleRev} key={singleRev.id}></RivewCard>
                    ))
                }
            </div>
        </div>
    );
};

export default CustomerReview;