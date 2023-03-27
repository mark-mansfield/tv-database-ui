import React from 'react';
import { Formik, Field, Form } from 'formik';
import { FormValues } from '../../types';

export const Search: React.FC<{
  handleSubmit: (values: FormValues) => void;
}> = ({ handleSubmit }) => {
  return (
    <Formik initialValues={{ search: '' }} onSubmit={(values: FormValues) => handleSubmit(values)}>
      <Form className="search" role="search">
        <label htmlFor="search" className="visuallyHidden">
          search
        </label>
        <Field
          id="search"
          name="search"
          placeholder="Enter the name of a TV Show"
          type="search"
          tabIndex={0}
        />
        <button type="submit" aria-label="search button" tabIndex={0}>
          Search
        </button>
      </Form>
    </Formik>
  );
};
