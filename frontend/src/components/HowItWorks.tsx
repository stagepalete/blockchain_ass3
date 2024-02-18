import React from 'react';
import '../App.css';
import '../styles/HowItWorks.css';

interface WorkItemProps {
    imgSrc: string;
    altText: string;
    title: string;
}

const WorkItem: React.FC<WorkItemProps> = ({ imgSrc, altText, title }) => {
    return (
        <div className='work_item'>
            <div className='work_item_img'>
                <img src={imgSrc} alt={altText} />
            </div>
            <h2>{title}</h2>
        </div>
    );
};

const HowItWorks: React.FC = () => {
    return (
        <section className='how_it_works'>
            <h2 className='section_title'>How it works</h2>
            <div className='work_grid'>
                <WorkItem
                    imgSrc='./assets/image/wallet.png'
                    altText='wallet'
                    title='Set up your wallet'
                />
                <WorkItem
                    imgSrc='./assets/image/collection.png'
                    altText='collection'
                    title='Create your NFTs'
                />
                <WorkItem
                    imgSrc='./assets/image/nfts.png'
                    altText='nfts'
                    title='Add your NFTs'
                />
                <WorkItem
                    imgSrc='./assets/image/lists.png'
                    altText='lists'
                    title='List them for sale'
                />
            </div>
        </section>
    );
};

export default HowItWorks;
