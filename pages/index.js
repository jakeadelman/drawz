import Draw from "../components/Draw";
// import Nav from "../components/Nav";
import "bootstrap/dist/css/bootstrap.min.css";

export default () => {
  return (
    <div>
      <div>
        <Draw />
      </div>
      <style jsx global>
        {`
          body {
            background-color: #04002b;
          }
        `}
      </style>
    </div>
  );
};
