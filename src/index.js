import React from 'react';
import './index.css';

class Fancy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      showList: false,
      currentFocus: 0
    };
    this.compare = (a, b) => {
      if (a.text < b.text)
        return -1;
      if (a.text > b.text)
        return 1;
      return 0;
    };
    this.toggleList = () => {
      if (this.state.input.length >= 2) {
        this.setState({ showList: true });
      } else {
        this.setState({ showList: false });
      }
    };
    this.changeInput = (e) => {
      this.setState({ input: e.target.value }, () => {
        this.toggleList();
        this.props.callback(this.state.input);
      });
    };
    this.highlight = (text) => {
      return { __html: `<strong>${text.substr(0, this.state.input.length)}</strong>${text.substr(this.state.input.length)}` };
    };
    this.renderList = () => {
      if (this.props.list.length > 0) {
        const list__arr = this.props.list.sort(this.compare);
        const html_li = [];
        list__arr.map((val, index) => {
          if (typeof val === 'object') {
            if (val.text.substr(0, this.state.input.length).toLowerCase() === this.state.input.toLowerCase()) {
              html_li.push(
                <li data-value={val.text} key={index} style={{ background: `${index === this.state.currentFocus ? '#f5f5f5' : ''}` }}>
                  <a href={val.href} dangerouslySetInnerHTML={this.highlight(val.text)} />
                </li>
              );
            }
          } else {
            html_li.push(
              <li data-value={val} key={index} style={{ background: `${index === this.state.currentFocus ? '#f5f5f5' : ''}` }}>
                <a dangerouslySetInnerHTML={this.highlight(val)} />
              </li>
            );
          }
        });
        if (html_li.length === 0) {
          html_li.push(
            <li key="no-data">No data</li>
          );
        }
        return html_li;
      }
    };
    this.select = (e) => {
      if (this.state.showList) {
        let lists = document.querySelector('#dp__list ul').childNodes;
        if (e.which === 40 && lists[this.state.currentFocus]) {
          if ((lists.length - 1) !== this.state.currentFocus) {
            this.setState({ currentFocus: this.state.currentFocus + 1 });
          }
        } else if (e.which === 38) {
          if (this.state.currentFocus > 0) {
            this.setState({ currentFocus: this.state.currentFocus - 1 });
          }
        } else if (e.which === 13) {
          if (lists[this.state.currentFocus].childNodes[0].getAttribute('href')) {
            if (this.props.target === 'open') {
              window.open(lists[this.state.currentFocus].childNodes[0].getAttribute('href'), '_blank');
            } else {
              window.location.href = lists[this.state.currentFocus].childNodes[0].getAttribute('href');
            }
          }
          this.setState({ input: lists[this.state.currentFocus].getAttribute('data-value') });
        }
        return false;
      }
    };

    // Styles
    this.placeholder = 'Enter your text';
    if (props) {
      if (props.placeholder) {
        this.placeholder = props.placeholder;
      }
    }
  }
  render() {
    return (
      <div className={`dp ${this.props.containerClass ? this.props.containerClass: ''}`}>
        <input
          id="dp__input"
          className={`dp__input ${this.props.inputClass ? this.props.inputClass : ''}`}
          value={this.state.input}
          onChange={(e) => this.changeInput(e)}
          placeholder={this.placeholder}
          onKeyDown={(e) => this.select(e)}
          // onBlur={() => this.setState({ showList: false })}
        />
        {
          this.state.showList &&
          <div
            id="dp__list"
            className={`dp__list ${this.props.listClass ? this.props.listClass : ''}`}
            style={this.dp__list_style}
            >
            <ul>
              { this.renderList() }
            </ul>
          </div>
        }
      </div>
    );
  }
}
export default Fancy;
