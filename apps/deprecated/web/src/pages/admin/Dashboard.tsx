import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="m-5 bg-cyan-400 p-4">Dashboard</h1>
      <div className="card bg-slate-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor accusantium ullam qui
        quisquam eos nihil eius optio cupiditate! Voluptatum tempora cupiditate illo blanditiis
        laboriosam dolore ipsam voluptates enim cumque earum?
      </div>
    </>
  );
};

export default Dashboard;
