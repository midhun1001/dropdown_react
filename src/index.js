import React from 'react';
import './index.css';

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.list,
      input: '',
      showList: false,
      currentFocus: 0,
      multi: [],
      arrDir: '',
    };
    this.handleClickOutside = (e) => {
      if (!document.getElementById('customizable-dropdown').contains(e.target)) {
        this.setState({ showList: false });
      }
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.FocusEvent = (e, flag) => {
      e.persist();
      this.setState({ showList: flag }, () => {
        if (this.props.multiselect) {
          const li = document.querySelector('#dp__list ul').childNodes;
          li[this.state.currentFocus].style.backgroundColor = '#f5f5f5';
          li[this.state.currentFocus].setAttribute('data-selected', 'active');
        }
      });
      if (flag) {
        this.setState({ arrDir: 'arrow_down' });
      } else {
        this.setState({ arrDir: '' });
      }
      if (this.props.focus) {
        const focusData = {
          currentInput: this.state.input,
          event: e
        };
        if (this.props.multiselect) {
          focusData.multiSelect = this.state.multi;
        }
        this.props.focus(focusData);
      }
    };
    this.changeInput = (e, flag) => {
      e.persist();
      const callBack = {};
      if (flag === 'clear') {
        this.setState({ input: '', multi: [] });
        document.getElementById('dp__input').focus();
      } else {
        this.setState({ input: e.target.value }, () => {
          if (this.props.callback) {
            callBack.currentInput = this.state.input;
            callBack.event = e;
            if (this.props.multiselect) {
              callBack.multiSelect = this.state.multi;
            }
            this.props.callback(callBack);
          }
        });
      }
    };
    this.defaultWidth = () => {
      let multiWidth = 0;
      const parentWidth = document.getElementsByClassName('dp')[0].offsetWidth;
      const closeWidth = document.getElementsByClassName('dp__clear')[0].offsetWidth;
      if (this.props.multiselect) {
        multiWidth = document.getElementsByClassName('dp__selectedInput')[0].offsetWidth;
      }
      const defaultWidth = parentWidth - closeWidth;
      const multiSelectWidth = defaultWidth - multiWidth;
      return {
        defaultWidth,
        multiSelectWidth
      };
    };
    this.customCallback = () => {
      const callBack = {
        currentInput: this.state.input,
        event: e,
        multiSelect: this.state.multi
      };
      this.props.callback(callBack);
    };
    this.setInput = (e, input) => {
      e.persist();
      if (this.props.multiselect) {
        if (e.type === 'click') {
          document.querySelector('#dp__list ul li[data-selected="active"]').style.backgroundColor = '';
          document.querySelector('#dp__list ul li[data-selected="active"]').removeAttribute('data-selected');
          e.target.parentNode.setAttribute('data-selected', 'active');
          e.target.parentNode.style.backgroundColor = "#f5f5f5";
          const data = e.target.parentNode.getAttribute('data-value');
          this.setState({ currentFocus: this.state.list.indexOf(data) });
          document.getElementById('dp__input').focus();
        }
        const ele = document.querySelector('#dp__list ul li[data-selected="active"]');
        const multi = this.state.multi;
        if (!multi.includes(ele.getAttribute('data-value'))) {
          multi.push(ele.getAttribute('data-value'));
          this.setState({ multi, input: '' }, () => {
            document.getElementById('dp__input').style.width = `${this.defaultWidth().multiSelectWidth}px`;
            document.querySelector('#dp__list ul li[data-selected="active"] a span').style.display = 'inline'
            if (this.props.callback) {
              this.customCallback();
            }
          });
        }
      } else {
        e.target.parentNode.setAttribute('data-selected', 'active');
        const data = document.querySelector('#dp__list ul li[data-selected="active"]').getAttribute('data-value');
        this.setState({ input: data }, () => {
          document.getElementById('dp__input').focus();
          if (this.props.callback) {
            this.customCallback();
          }
        });
      }
    };
    this.removeFromMulti = (val) => {
      if (this.state.multi.includes(val)) {
        const multi = this.state.multi;
        const index = multi.indexOf(val);
        multi.splice(index, 1);
        this.setState({ multi }, () => {
          document.querySelector(`#dp__list ul li[data-value="${val}"]`).style.backgroundColor = '';
          document.querySelector(`#dp__list ul li[data-value="${val}"]`).removeAttribute('data-selected');
          document.querySelector(`#dp__list ul li[data-value="${val}"] a span`).style.display = 'none'
          document.getElementById('dp__input').focus();
        });
      }
    };
    this.renderMulti = () => {
      return (
        this.state.multi.map((val, index) => (
          <div className="multiselect__item" key={index}>
            <span>
              <button onClick={() => this.removeFromMulti(val)}>
                &#10005;
              </button>
              {val}
            </span>
          </div>
        ))
      );
    };
    this.highlight = (text) => {
      return { __html: `<strong>${text.substr(0, this.state.input.length)}</strong>${text.substr(this.state.input.length)} <span class="list__selected">Selected</span>` };
    };
    this.renderList = () => {
      if (this.state.list.length > 0) {
        const html_li = [];
        this.state.list.map((val, index) => {
          if (typeof val === 'object') {
            if (val.text.substr(0, this.state.input.length).toLowerCase() === this.state.input.toLowerCase()) {
              html_li.push(
                <li data-value={val.text} key={index}>
                  <a href={val.href} dangerouslySetInnerHTML={this.highlight(val.text)} />
                </li>
              );
            }
          } else {
            if (val.substr(0, this.state.input.length).toLowerCase() === this.state.input.toLowerCase()) {
              html_li.push(
                <li
                  data-value={val}
                  key={index}
                >
                  <a dangerouslySetInnerHTML={this.highlight(val)} onClick={(e) => this.setInput(e, val)} />
                </li>
              );
            }
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
    this.scrollList = (dir, ele) => {
      if (dir === 'down') {
        const divHeight = document.getElementById('dp__list').offsetHeight;
        const scrollPos = document.getElementById('dp__list').scrollTop;
        const elePos = ele.offsetTop;
        const eleHei = ele.offsetHeight;
        if (elePos > divHeight) {
          document.getElementById('dp__list').scrollTop = scrollPos + eleHei;
        }
      } else {
        const scrollPos = document.getElementById('dp__list').scrollTop;
        const elePos = ele.offsetTop;
        const eleHei = ele.offsetHeight;
        if (elePos < scrollPos) {
          document.getElementById('dp__list').scrollTop = scrollPos - eleHei;
        }
      }
    };
    this.select = (e) => {
      const li = document.querySelector('#dp__list ul').childNodes;
      if (e.which === 40) {
        if (li.length - 1 > this.state.currentFocus) {
          this.setState({ currentFocus: this.state.currentFocus + 1 }, () => {
            const prev = li[this.state.currentFocus - 1];
            const next = li[this.state.currentFocus];
            if (prev) {
              prev.style.backgroundColor = '';
              prev.removeAttribute('data-selected');
            }
            if (next) {
              next.style.backgroundColor = '#f5f5f5';
              next.setAttribute('data-selected', 'active');
              this.scrollList('down', next);
            }
          });
        }
      } else if (e.which === 38) {
        if (this.state.currentFocus !== 0) {
          const prev = li[this.state.currentFocus - 1];
          const next = li[this.state.currentFocus];
          prev.style.backgroundColor = '#f5f5f5';
          prev.setAttribute('data-selected', 'active');
          next.style.backgroundColor = '';
          next.removeAttribute('data-selected');
          this.scrollList('up', prev);
          this.setState({ currentFocus: this.state.currentFocus - 1 });
        }
      } else if (e.which === 13) {
        if (typeof this.props.list === 'object') {
          document.querySelector('#dp__list ul li[data-selected="active"] a').click();
        } else {
          this.setInput(e);
        }
      }
      if (this.props.keydown) {
        const focusData = {
          currentInput: this.state.input,
          event: e
        };
        if (this.props.multiselect) {
          focusData.multiSelect = this.state.multi;
        }
        this.props.keydown(focusData);
      }
    };
    this.placeholder = 'Enter your text';
    if (props) {
      if (props.placeholder) {
        this.placeholder = props.placeholder;
      }
    }
  }
  componentDidMount() {
    document.getElementById('dp__input').style.width = `${this.defaultWidth().defaultWidth}px`;
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.list !== this.props.list) {
      this.setState({ list: nextProps.list });
    }
  }
  render() {
    return (
      <div
            id="customizable-dropdown"
            className={`dp ${this.props.containerClass ? this.props.containerClass: ''}` }
          >
            {
              this.props.multiselect && this.props.multiselect === true &&
              <div className="dp__selectedInput">
                {this.renderMulti()}
              </div>
            }
            <input
              id="dp__input"
              className={`dp__input ${this.props.inputClass ? this.props.inputClass : ''}`}
              value={this.state.input}
              placeholder={this.placeholder}
              onChange={(e) => this.changeInput(e)}
              onKeyDown={(e) => this.select(e)}
              onFocus={(e) => this.FocusEvent(e, true)}
            />
            <button className="dp__clear" onClick={(e) => this.changeInput(e, 'clear')}>
              <span className={`${this.state.arrDir} arrow`} >&#8227;&nbsp;</span>
              <span>&#10005;</span>
             </button>
            {
              this.state.showList &&
              <div
                id="dp__list"
                className={`dp__list ${this.state.listClass ? this.state.listClass : ''}`}
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
export default Dropdown;
