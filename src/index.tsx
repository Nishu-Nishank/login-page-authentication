import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import './style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableData from './TableData.jsx';
const App = () => {
  const [check, setCheck] = useState(false);
  const [data, setData] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const validateCredentials = () => {
    if (!email && !password) {
      toast.info('Please enter email and password');
    } else if (!email) {
      toast.info('Please enter email');
    } else if (!password) {
      toast.info('Please enter password');
    }
    if (email && password) {
      login();
    }
  };
  const handleActivity = () => {
    localStorage.setItem('lastActivity', JSON.stringify(Date.now()));
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);
    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
    };
  }, []);

  const login = () => {
    const data = { email: email, password: password };
    fetch('https://reqres.in/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          toast.info('Authentication failed');
          throw new Error('Authentication failed');
        }
      })
      .then((data) => {
        const authToken = data.token;
        localStorage.setItem('authToken', authToken);
        toast.info('Logged in Successfully');
        fetchData();
        localStorage.setItem('lastActivity', JSON.stringify(Date.now()));
        const checkActivity = () => {
          const lastActivity = JSON.parse(localStorage.getItem('lastActivity'));
          if (lastActivity) {
            const currentTime = Date.now();
            const timeSinceLastActivity = currentTime - lastActivity;
            if (timeSinceLastActivity >= 5 * 60 * 1000) {
              localStorage.removeItem('authToken');
            }
          }
        };
        const inactivityTimer = setInterval(checkActivity, 60000);
      })
      .catch((error) => {
        toast.info(error);
        console.error(error);
      });
  };
  const fetchData = () => {
    const authToken = localStorage.getItem('authToken');
    fetch('https://reqres.in/api/unknown', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-type': 'application/json',
      },
    })
      .then(async (response) => {
        const res = await response.json();
        setData([...res.data]);
      })
      .catch((error) => {
        toast.info(error);
      });
  };
  return (
    <div>
      <div className="m-8">
        <img
          src="https://drive.google.com/uc?export=view&id=1hvRAGrdq0SqFBZApx2--IcuDf-DOmOBH"
          alt="Wissen Connect"
          loading="lazy"
        />
        {!data.length && (
          <div>
            <h3 className="my-6 font-bold">Hello there, Sign in to continue</h3>
            <div>
              <div className="my-3">
                <p className="text-gray">Email</p>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 py-3 mt-1 rounded-md px-2 w-96 text-blue"
                />
              </div>
              <div className="my-6">
                <p className="text-gray">Password</p>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 py-2 mt-1 rounded-md px-2 w-96 text-blue text-2xl"
                />
              </div>
              <div className="w-96">
                <input type="checkbox" onChange={() => setCheck(!check)} />
                <label className="pl-2">
                  By creating or logging into an account, you are agreeing with
                  our
                  <b> Terms & Conditions</b> and <b>Privacy Policys</b>
                </label>
              </div>
              <button
                disabled={!check}
                className={`mt-10 w-90 text-center border bg-blue text-white py-3 px-44 rounded-md cursor-pointer ${
                  !check && 'disabled'
                }`}
                onClick={validateCredentials}
              >
                Next
              </button>
            </div>
          </div>
        )}
        {data.length > 0 && <TableData listData={data} />}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

render(<App />, document.getElementById('root'));
