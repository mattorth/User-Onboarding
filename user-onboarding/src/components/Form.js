import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const UserForm = props => {
    const [user, setUser] = useState([]);

    useEffect(() => {
        if (props.status) {
            setUser([...user, props.status]);
        }
    }, [props.status]);

    return (
        <div>
            <Form>
                <Field type="text" name="name" placeholder="Name" />
                {props.touched.name && props.errors.name && (
                    <p className="error">{props.errors.name}</p>
                )}
                <Field type="email" name="email" placeholder="Email" />
                {props.touched.email && props.errors.email && (
                    <p className="error">{props.errors.email}</p>
                )}
                <Field type="password" name="password" placeholder="Password" />
                {props.touched.password && props.errors.password && (
                    <p className="error">{props.errors.password}</p>
                )}
                <label>
                    <Field type="checkbox" name="tos" checked={props.values.tos} />
                    Accept Terms of Service
                </label>
                {props.touched.tos && props.errors.tos && (
                    <p className="error">{props.errors.tos}</p>
                )}
                <button type="submit" disabled={props.isSubmitting}>Submit</button>
            </Form>
            {user.map(user => (
                <ul key={user.id}>
                <li>Name: {user.name}</li>
                <li>Email: {user.email}</li>
                </ul>
            ))}
        </div>
        
    );
}

const FormikUserForm = withFormik({
    mapPropsToValues({...props}) {
        return {
        name: props.name || "",
        email: props.email || "",
        password: props.password || "",
        tos: props.tos || false,
    };
},
validationSchema: Yup.object().shape({
    name: Yup.string().required("Name required."),
    email: Yup.string().required("Email required"),
    password: Yup.string().required().min(8, "Password must be at least 8 characters long"),
    tos: Yup.boolean().oneOf([true], "Must agree to Terms of Service")
}),
handleSubmit(values, { setStatus, resetForm, setErrors, setSubmitting }) {
    console.log("submit pressed... sending.");
    axios
        .post("https://reqres.in/api/users", values)
        .then(res => {
            console.log(res);
            setStatus(res.data);
            resetForm();
            setSubmitting(false);
        })
        .catch(err => {
            console.log(err);
            setSubmitting(false);
        })
}
})(UserForm);

export default FormikUserForm;