"use client";

import Image from 'next/image';
import styles from './styles/page.module.scss';
import logo from "./logo.png"
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { useState, KeyboardEventHandler } from 'react';
const content = require("./content.json");


interface Option {
  readonly label: string;
  readonly value: string;
}


const createOption = (label: string) : Option => ({
  label, value: label
});


export default function Home() {
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


  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Image src={logo} alt='Rejectionator Logo' className={styles.logo}/>
        <p className={styles.tagline}>
          Reject job applications with ease! Simply fill up the form below and hit send!
        </p>
        <form>
          <label>
            Company/Recruiter Name
            <input name="name" type="text" placeholder='Eg: Rejectionator' onChange={(e) => setFormValues({...formValues, name: e.target.value})}/>
          </label>
          <label>
            <div>Reply Email</div>
            <small>(Leave empty if you do not want replies)</small>
            <input name="replyEmail" type="text" placeholder='Eg: abc@def.ghi' onChange={(e) => setFormValues({...formValues, replyEmail: e.target.value})}/>
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
            />
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
          <button type="submit">Send Emails</button>
        </form>
        <small>
          &copy; <a href="https://aquibmahmood.com">Sheikh Aquib Mahmood</a>, 2023 {(new Date()).getFullYear() > 2023 ? `- ${(new Date()).getFullYear()}` : ""}
        </small>
      </div>
    </main>
  )
}
