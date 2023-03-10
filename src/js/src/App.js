import React, { Component } from 'react';
import './App.css';
import Container from './Container';
import AddStudentForm from './forms/AddStudentForm';
import Footer from './Footer';
import { errorNotification } from './forms/notification';
import { 
  Table,
  Avatar,
  Spin,
  Modal
 } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { getAllStudents } from './client';


const getIndicatorIcon = () => <LoadingOutlined style={{  fontSize: 24 }} spin />


class App extends Component {

  state = {
    students: [],
    isFetching: false,
    isAddStudentModalVisible: false
  }

  componentDidMount() {
    this.fetchStudents();
  }

  openAddStudentModal = () =>  this.setState({isAddStudentModalVisible: true})
  closeAddStudentModal = () =>  this.setState({isAddStudentModalVisible: false})

  fetchStudents = () => {
    this.setState({
      isFetching: true
    });
    
    getAllStudents().then(res => res.json().then(students => {
      console.log(students);
      this.setState({ 
        students,
        isFetching: false
      });
    }))
    .catch(error => {
      const message = error.error.error;
      errorNotification(message, message);
      this.setState({
        isFetching: false
      });
    });
  }

  render() {

    const { students, isFetching, isAddStudentModalVisible } = this.state;
    
  
    if (isFetching){
      return (
        <Container>
          <Spin indicator={getIndicatorIcon()}/>
        </Container>
      );
    }

    if (students && students.length) {

      const columns = [
        {
          title:'',
          key:'avatar',
          render: (text, student) => (
            <Avatar size='large'>
              {`${student.firstName.charAt(0).toUpperCase()}${student.lastName.charAt(0).toUpperCase()}`}
            </Avatar>
          )
        },
        {
          title: 'Student ID',
          dataIndex: 'studentID',
          key: 'studentID'

        },
        {
          title: 'First Name',
          dataIndex: 'firstName',
          key: 'firstName'

        },
        {
          title: 'Last Name',
          dataIndex: 'lastName',
          key: 'lastName'
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email'

        },
        {
          title: 'Gender',
          dataIndex: 'gender',
          key: 'gender'

        }

      ];

      return (
        <Container>
          <Table 
            style={{paddingBottom : '100px'}}
            dataSource={students} 
            columns={columns} 
            pagination={false}
            rowKey='studentID'/>
          <Modal
            title= 'Add new student'
            open= {isAddStudentModalVisible}
            onOk= {this.closeAddStudentModal}
            onCancel= {this.closeAddStudentModal} 
            width= {1000}>
              <h1>Hello Modal with Antd</h1>
              <AddStudentForm
                onSuccess={() => {
                  this.closeAddStudentModal();
                  this.fetchStudents();
                  }

                }
              />
          </Modal>
          <Footer 
          numberOfStudents={students.length}
          handleAddStudentClickEvent= {this.openAddStudentModal}/>
        </Container>
      );

    }

  

    return <h1> No student found </h1>
  }


}



export default App;
