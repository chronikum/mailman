import React, { Component } from "react";
import { Formik } from "formik";
import yup from "yup";
import { toast } from "react-toastify";

import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import { withStyles } from "material-ui/styles";

import { handleRequestError } from "../../util";

const styles = theme => ({
  paper: {
    maxWidth: "400px",
    margin: "100px auto"
  },
  header: {
    padding: "2em 0",
    background: theme.palette.primary[500],
    borderBottom: "1px solid #eee",
    "& > *": {
      color: theme.palette.common.white
    }
  },
  form: {
    display: "flex",
    flexFlow: "column",
    padding: "0 2em",
    "& > button": {
      margin: "1em 0"
    }
  },
  button: {
    marginBottom: "1em"
  }
});

const schema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required("Email is required"),
  password: yup.string().required("Password is required")
});

class LoginForm extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <div className={classes.header}>
          <Typography type="headline" align="center">
            Login
          </Typography>
        </div>
        <div className={classes.body}>
          <Formik
            initialValues={{
              email: "",
              password: ""
            }}
            validationSchema={schema}
            validateOnChange={true}
            onSubmit={(values, { resetForm }) => {
              this.props
                .submit(values)
                .then(() => {
                  toast.success("You are now logged in");
                  resetForm();
                })
                .catch(error => {
                  const { message } = handleRequestError(error);
                  toast.error("Error: " + message);
                });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              handleBlur,
              isSubmitting,
              isValid,
              setFieldValue,
              setFieldTouched
            }) => (
              <form
                className={classes.form}
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <TextField
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  id="email"
                  label="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  margin="normal"
                  autoFocus
                />
                <TextField
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  margin="normal"
                />
                <Button
                  className={classes.button}
                  raised
                  color="accent"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Login
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(LoginForm);
