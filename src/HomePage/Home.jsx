import React from 'react';
import Banner from './Banner';
import PostBanner from './PostBanner';
import OurServices from './OurServices';
import Company from './Company';
import PercelView from './PercelView';
import Satisfaction from './Satisfaction';
import CustomerReview from './CustomerReview';
import FAQ from './FAQ';

const Home = () => {
    return (
        <div className='flex flex-col'>
           <Banner></Banner>
           <PostBanner></PostBanner>
           <OurServices></OurServices>
           <Company></Company>
           <PercelView></PercelView>
           <Satisfaction></Satisfaction>
           <CustomerReview></CustomerReview>
           <FAQ></FAQ>
        </div>
    );
};

export default Home;