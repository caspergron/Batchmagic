import React from 'react';
import { Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PropTypes from 'prop-types';

const CustomTooltip = ({ title, children, ...props }) => (
  <Tooltip
    title={
      <div
        style={{
          backgroundColor: 'white',
          color: 'black',
          padding: '16px',
          borderRadius: '8px',
          width: '240px',
          border: '1px solid #e0e0e0',
        }}
      >
        {title}
      </div>
    }
    {...props}
  >
    {children}
  </Tooltip>
);

CustomTooltip.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

const CostBreakdownTooltip = ({ cost }) => {
  const TooltipContent = () => (
    <>
      <h3
        style={{
          color: '#FFA500',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '8px',
        }}
      >
        Sales
      </h3>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <span>Sales value</span>
        <span>{cost.sales_price} DKK</span>
      </div>

      <h3
        style={{
          color: '#FFA500',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '8px',
        }}
      >
        Costs Breakdown
      </h3>
      <div style={{ marginBottom: '12px' }}>
        {['Products', 'Packaging', 'Salary'].map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <span>{item}</span>
            <span>{cost[item.toLowerCase() + '_cost']} DKK</span>
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            marginTop: '4px',
          }}
        >
          <span>TOTAL</span>
          <span>{cost.total_cost ?? 0} DKK</span>
        </div>
      </div>

      <h3
        style={{
          color: '#FFA500',
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '4px',
        }}
      >
        Profit
      </h3>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          fontWeight: 'bold',
          color: '#FFA500',
        }}
      >
        <span>{cost.profit ?? 0} DKK</span>
      </div>
    </>
  );

  return (
    <CustomTooltip title={<TooltipContent />} arrow placement="top">
      <VisibilityIcon
        style={{ cursor: 'pointer', fontSize: '20px', color: '#757575' }}
      />
    </CustomTooltip>
  );
};

export default CostBreakdownTooltip;

CostBreakdownTooltip.propTypes = {
  cost: PropTypes.object.isRequired,
};
