import ViewDetailRow from './ViewDetailRow';

function ViewDetails({ data }) {
  if (!data || data.length === 0) {
    return <div>*Немає даних*</div>;
  }

  return data.map((item, index) => {
    const { icon, label, value, isLink = false, linkTo = '', extra } = item;

    return (
      <ViewDetailRow
        key={index}
        extra={extra}
        icon={icon}
        isLink={isLink}
        label={label}
        linkTo={linkTo}
        value={value}
      />
    );
  });
}

export default ViewDetails;
