"use client";

import Image from 'next/image';
import styles from './styles/page.module.scss';
import logo from "./logo.png"
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { useState, KeyboardEventHandler, FormEventHandler } from 'react';
const content = require("./content.json");


interface Option {
    readonly label: string;
    readonly value: string;
}


const createOption = (label: string) : Option => ({
    label, value: label
});


export default function Home() {
    // For the creatable select
    const [selectInputValue, setSelectInputValue] = useState<string>("");
    const [formValues, setFormValues] = useState<{
        name: string,
        replyEmail: string,
        emailAddresses: readonly Option[],
        tone: Option | null
    }>({
        name: "",
        replyEmail: "",
        emailAddresses: [],
        tone: createOption(content.types[0])
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<{name: string, emailAddresses: string}>({
        name: "",
        emailAddresses: ""
    });
    const [isUnexpectedError, setUnexpectedError] = useState<boolean>(false);
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);

    // Keyboard event handler for the creatable select
    const handleKeyDown: KeyboardEventHandler = (event) => {
        if (!selectInputValue) return;
        switch (event.key) {
            case "Enter":
            case "Tab":
            case " ":
                setFormValues((prev) => ({
                    ...prev,
                    emailAddresses: [...prev.emailAddresses, createOption(selectInputValue)]
                }));
                setSelectInputValue("");
                event.preventDefault();
        }
    };

    const handleSubmit: FormEventHandler = (event) : void => {
        event.preventDefault();

        // Error Checking on Frontend
        const errorMessages : {name: string, emailAddresses: string} = {
            name: "",
            emailAddresses: ""
        };
        
        if (!formValues.name.length) {
            errorMessages.name = "Name cannot be empty.";
        }

        if (!formValues.emailAddresses.length) {
            errorMessages.emailAddresses = "There must be at least one email address.";
        }

        if (errorMessages.emailAddresses.length || errorMessages.name.length) {
            setFormErrors(errorMessages);
            return;
        }

        setIsLoading(true);
        setFormErrors({
            name: "",
            emailAddresses: ""
        });
        setUnexpectedError(false);
        setIsSuccessful(false);

        fetch("/api", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: formValues.name,
                replyEmail: formValues.replyEmail,
                emailAddresses: formValues.emailAddresses.map((item) => item.label),
                tone: formValues.tone?.label
            })
        })
        .then((response) => response.json())
        .then((final) => {
            if (!final.success) throw new Error("Unexpected Error Occured");
            else {
                setIsSuccessful(true);
                setIsLoading(false);
            }
        })
        .catch((error) => {
            setIsSuccessful(false);
            setIsLoading(false);
            setFormErrors({
                name: "",
                emailAddresses: ""
            });
            setUnexpectedError(true);
        })
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Image src={logo} alt='Rejectionator Logo' className={styles.logo}/>
                <p className={styles.tagline}>
                    Reject job applications with ease! Simply fill up the form below and hit send! <br />
                    <small style={{color: "red"}}>Please note: This is a joke.</small>
                </p>
                <form onSubmit={handleSubmit}>
                    <label>
                        Company/Recruiter Name
                        <input name="name" type="text" placeholder='Eg: Rejectionator' onChange={(e) => setFormValues({...formValues, name: e.target.value})} disabled={isLoading}/>
                        {
                            formErrors.name.length > 0 &&
                            <small className={styles.error} aria-description='Error regarding company or recruiter name.'>{formErrors.name}</small>
                        }
                    </label>

                    <label>
                        <div>Reply Email</div>
                        <small>(Leave empty if you do not want replies)</small>
                        <input name="replyEmail" type="text" placeholder='Eg: abc@def.ghi' onChange={(e) => setFormValues({...formValues, replyEmail: e.target.value})} disabled={isLoading}/>
                    </label>

                    <label>
                        <div>Email Addresses</div>
                        <small>(Type an email address and press Enter or Space to insert)</small>
                        <CreatableSelect
                            components={{DropdownIndicator: null}}
                            name='emailAddresses'
                            inputValue={selectInputValue}
                            isClearable
                            isMulti
                            menuIsOpen={false}
                            onChange={(value) => setFormValues({...formValues, emailAddresses: value})}
                            onInputChange={(value) => setSelectInputValue(value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Eg: a@b.com c@d.com...."
                            value={formValues.emailAddresses}
                            classNames={{
                                control: () => (styles.select),
                                placeholder: () => (styles.selectPlaceholder)
                            }}
                            isDisabled={isLoading}
                        />
                        {
                            formErrors.emailAddresses.length > 0 &&
                            <small className={styles.error} aria-description='Error regarding email addresses.'>{formErrors.emailAddresses}</small>
                        }
                    </label>

                    <label>
                        <div>Message Tone</div>
                        <Select
                            name='tone'
                            onChange={(value) => setFormValues({...formValues, tone: value})}
                            value={formValues.tone}
                            classNames={{
                                control: () => (styles.select),
                                placeholder: () => (styles.selectPlaceholder)
                            }}
                            options={content.types.map((item : string) => createOption(item))}
                            isDisabled={isLoading}
                        />
                    </label>

                    <label>
                        Preview
                        <div className={styles.preview}>
                            <p className={styles.subject}>
                                <strong>Subject:</strong> Your application to {formValues.name}
                            </p>
                            <div dangerouslySetInnerHTML={{__html: content[formValues.tone? formValues.tone.label : ""]}}></div>
                        </div>
                    </label>

                    {
                        isUnexpectedError &&
                        <small className={styles.error}>An unexpected error occured. Please try again.</small>
                    }

                    {
                        isSuccessful &&
                        <small className={styles.success}>Rejections sent successfully.</small>
                    }
                    
                    <button type="submit" disabled={isLoading}>
                        {
                            isLoading ? "Sending..." : "Send Emails"
                        }
                    </button>
                </form>
                <small>
                    &copy; <a href="https://aquibmahmood.com" target='_blank'>Sheikh Aquib Mahmood</a>, 2023 {(new Date()).getFullYear() > 2023 ? `- ${(new Date()).getFullYear()}` : ""}
                </small>
            </div>
        </main>
    )
}
