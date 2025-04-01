import React from 'react';
import './InfoCard.css';

const InfoCard = () => {
  return (
    <div className="padding-vertical-info">
      <h1 className="text-white">
        Why should you <br /> <span className="text-warning">embrace</span>{' '}
        Batch Magic?{' '}
      </h1>

      <div>
        <div className="row text-white margin-info">
          <div className="col border-line-left">
            The easiest digital <br /> product batch tracking <br /> system
          </div>
          <div className="col border-line-left">
            Can deliver accurate <br /> ingrediens data direct to <br />{' '}
            E-commerce shops
          </div>
          <div className="col border-line-left">
            Full tracebility available <br /> to end-salespoint
          </div>
        </div>
        <div className="row text-white">
          <div className="col border-line-left">
            Open API connection for <br /> product data syncing
          </div>
          <div className="col border-line-left">
            Create ingredient and <br /> allergen text for label <br />{' '}
            generation
          </div>
          <div className="col padding-custom-button">
            <h4 className="text-warning">Sounds clever right? </h4>
            <button className="button-custom-small">GET STARTED</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
