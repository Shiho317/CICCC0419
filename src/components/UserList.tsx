import React, { FC, useState, useEffect, useTransition } from "react";
import { Link } from "react-router-dom";
import { IUser } from "../model/IUser";
import { UserService } from "../services/UserService";

interface IState {
  loading: boolean;
  users: IUser[];
  errorMessage: string;
}

const UserList: FC = () => {
  const [state, setState] = useState<IState>({
    loading: false,
    users: [] as IUser[],
    errorMessage: ""
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, loading: !prev.loading }));

    UserService.getAllUsers()
      .then((response) => {
        setState({
          ...state,
          loading: false,
          users: response.data
        });
      })
      .catch((error) => {
        setState({
          ...state,
          loading: false,
          errorMessage: error.message
        });
      });
      
  }, []);

  if(state.loading){
      return(
          <div>LOADING......</div>
      )
  }

  return (
    <>
      <h3>UserList</h3>
      <div className="row">
        <div className="col">
          <table className="table text-center table-striped">
            <thead className="bg-success text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody>
              {state.users.length > 0 &&
                state.users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>
                      <Link to={`/userdetail/${user.id}`}>
                        {user.name}
                      </Link>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.company.name}</td>
                    <td>{user.website}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserList;
