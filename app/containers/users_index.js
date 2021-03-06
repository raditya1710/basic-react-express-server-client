import React, {Component} from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchUsers } from '../actions/index';
import Helmet from 'react-helmet';

class UsersIndex extends Component{
  componentWillMount(){
    this.props.fetchUsers();
  }

  showUsers(){
    return this.props.users.map((user)=>{
      return (
        <li className="list-group-item" key={user.id}>
          <Link to={"/users/" + user.id}>
            <span className="pull-xs-right"> {user.firstName} {user.lastName} </span>
          </Link>
        </li>
      );
    });
  }

  render(){
    return (
        <div>
          <Helmet title="Users" />
          <div className = "text-xs-right">
            <Link className="btn btn-primary btn-sm" to="/">Back to Home</Link><br />
            <Link className="btn btn-primary btn-lg" to="/users/new">Create New User</Link>
          </div>
          <div>
              Total Users : {this.props.users.length} <br />
              <ul className="list-group">
                  {this.showUsers()}
              </ul>
          </div>
        </div>
    );
  }
}

function mapStateToProps(state){
  return {
    users : state.users.all
  };
}

export default connect (mapStateToProps, { fetchUsers })(UsersIndex);
