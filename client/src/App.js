import React from 'react';
import SplitterLayout from 'react-splitter-layout';
import axios from 'axios';
import {UnControlled as CodeMirror} from 'react-codemirror2';

import 'react-splitter-layout/lib/index.css';
import './App.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/neat.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      replResponse: '',
      code: '',
    };
  }

  handleClick = (evt) => {
    evt.preventDefault();
    switch (evt.target.id) {
      case 'bakeSouffle':
        this.postCode();
        break;
      default:
        break;
    }
  }

  async postCode() {
    const data = {
      code: this.state.code,
    };

    await axios
      .post('http://harp.greymud.com/replapi/bakeSouffle', data)
      .then(res => this.setState({ replResponse: res.data }))
      .catch(err => console.log(err));    
  }

  onEditorChange = (editor, value) => {
    this.setState({
      code: editor.doc.getValue(),
    });
  }

  render() {
    return (
      <div className="App">
        <SplitterLayout horizontal={true}>
          <div id='inputDiv'>
            <CodeMirror
              className='code'
              options={{
                mode: 'strings',
                theme: 'xq-light',
                lineNumbers: true,
                smartIndent: false,
                fixedGutter: false,
                spellcheck: false,
              }}
              onChange={(editor, value) => {
                this.onEditorChange(editor, value);
              }}
            />
            <button type="button" id="bakeSouffle" onClick={(e) => this.handleClick(e)}>Bake Souffle</button>
          </div>
          <div id='outputDiv'>{this.state.replResponse}</div>
        </SplitterLayout>
      </div>
    );
  }
}

export default App;