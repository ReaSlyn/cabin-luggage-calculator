import styles from "./CompanyOption.module.css";

export default function CompanyOption({
  text,
  setSelectedCompany,
  setSelectorIsOpen,
}) {
  return (
    <label
      className={styles.option}
      onClick={() => {
        setSelectedCompany(text);
        setSelectorIsOpen(false);
      }}
    >
      {text}
      <input name="companyOption" value={text} type="radio" />
    </label>
  );
}
