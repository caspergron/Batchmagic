import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import PropTypes from 'prop-types';
const animatedComponents = makeAnimated();

const DropDown = ({
  dropDownValue,
  placeholderUpdated,
  handleDropDown,
  optionLabel,
  isClear,
  defaultValue,
  isDisabled,
}) => {
  const selectRef = useRef(null);

  const [value, setValue] = useState(null);

  useEffect(() => {
    if (isClear) {
      selectRef.current.clearValue();
    }
  }, [isClear]);

  const [isClearable] = useState(true);
  const [isSearchable] = useState(true);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (value, action) => {
    setValue(value);
    handleDropDown(value, action);
  };

  return (
    <div>
      <Select
        className="basic-single"
        classNamePrefix="select"
        placeholder={placeholderUpdated}
        isClearable={isClearable}
        components={animatedComponents}
        isSearchable={isSearchable}
        onChange={handleChange}
        ref={selectRef}
        getOptionLabel={(options) => options[optionLabel || 'name']}
        getOptionValue={(option) => option.id}
        options={dropDownValue}
        value={value}
        isDisabled={isDisabled || false}
      />
    </div>
  );
};

DropDown.propTypes = {
  dropDownValue: PropTypes.array,
  placeholderUpdated: PropTypes.string,
  handleDropDown: PropTypes.func,
  optionLabel: PropTypes.string,
  isClear: PropTypes.bool,
  defaultValue: PropTypes.object,
  isDisabled: PropTypes.bool,
};

export default DropDown;
