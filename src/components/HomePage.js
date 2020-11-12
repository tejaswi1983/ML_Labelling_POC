import React from 'react';
//import logo from '../../src/ebLogo.png';
import { message, Button, Table, Modal } from 'antd';
import 'antd/dist/antd.css';
//import { Table } from 'antd';
import axios from 'axios'
//import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';
//import json from '../constants/table.json'
import refresh from '../components/reload.svg'

class HomePage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      selectedFile: null,
      visible: false,
      ModalData: []
    }
    this.columns = [
      {
        title: 'Request ID',
        dataIndex: 'reqId',
      },
      {
        title: 'File Name',
        dataIndex: 'fileName',

      },
      {
        title: 'Time Taken in seconds',
        dataIndex: 'timeTaken',

      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        render: (records) => <Button type="primary" onClick={() => this.viewLabelStatus(records)}>View Labelling status</Button>
      }
    ];
  }

  upadatApi = () => {
    message.loading('Action in progress..',.4)
   
    axios({
      method: 'GET',
      url: 'http://15.206.125.200:8080/imageLabelling/getUploadedFileDetails',

    }).then((response) => {
      this.setState({
        data: response.data
      })
      message.success('Updated')
    });
  }

  componentDidMount() {

    axios({
      method: 'GET',
      url: 'http://15.206.125.200:8080/imageLabelling/getUploadedFileDetails',

    }).then((response) => {
      console.log("response", response)
      this.setState({
        data: response.data
      })
    });
  }

  onFileChange = event => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  onFileUpload = () => {
    message.loading('Action in progress..',.5)
    const formData = new FormData();
    formData.append("file", this.state.selectedFile);
    formData.append("fileName", this.state.selectedFile.name);

    axios.post("http://15.206.125.200:8080/imageLabelling/uploadFile", formData).then((response) => {
      console.log("response from api :", response);
      message.success('File Uploaded Successfully');
    });
  };

  viewLabelStatus = (records) => {
    axios({
      method: 'GET',
      url: `http://15.206.125.200:8080/imageLabelling/getLabelledFileDetails?requestId=${records.reqId}`,

    }).then((response) => {
      this.setState({
        ModalData: response.data[0]
      })
      this.setState({
        visible: true,
      });
    });
  }
  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  render() {
    function onChange(pagination, filters, sorter, extra) {
      console.log('params', pagination, filters, sorter, extra);
    }
    return (
  
        <section>
         
          <div className="upload">
            <label>Please upload your file.</label>

            <div className="file_upload">
              <input type="file" onChange={this.onFileChange} accept=".zip" />
              <button onClick={this.onFileUpload}>
                Upload!
                </button>
            </div>
          </div>
          <div classNam="tabel">
            <div className="refresh" onClick={() => this.upadatApi()}><img src={refresh} width="30" alt="refresh" /></div>
            <Table columns={this.columns} dataSource={this.state.data} onChange={onChange} />
          </div>
          { this.state.ModalData &&
          <Modal
            title="Labeling Status"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p><b>Process Id </b> : {this.state.ModalData.processId}</p>
            <p><b>Files Uploaded</b> :{this.state.ModalData.fileUploaded}</p>
            <p><b>Images labeled</b>: {this.state.ModalData.labelledImageCount}</p>
          </Modal>
  }
        </section>
     
    );
  }

}
export default HomePage;