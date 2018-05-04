<h1>Customizable React Dropdown Component</h1>

<h4>Totally customizable and light weight dropdown for react component.</h4>

<p>npm install customizable-dropdown-react</p>
<p>yarn add customizable-dropdown-react</p>

```html
import Dropdown "customizable-dropdown-react";

<Dropdown
  list="list of the items for the drop"
  callback={this.callback_func}
/>
```
<table>
          <thead>
            <tr>
              <th>Props</th>
              <th>Expected values</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>list</td>
              <td>
                <p>This prop can accept two types of data, i.e </p>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <p>1. Plain array</p>
                        [
                          "item1",
                          "item2",
                          ...
                        ]
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>2. Array object</p>
                        [
                          {
                            text: 'item1',
                            href: 'url for item1'
                          },
                          {
                            text: 'item2',
                            href: 'url for item2'
                          },
                          ...
                        ]
                        <p></p>
                        <p>In this case, on selecting the item from dropdown will redirect the page to the respective href.</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>multiselect</td>
              <td>
                <h5>Boolean</h5>
                <p>true: will enable the feature to multi select the items from the dropdown. by default the value is false.</p>
              </td>
            </tr>
            <tr>
              <td>focus</td>
              <td>
                <h5>Function</h5>
                <p>Pass the callback function on focus event of the component</p>
              </td>
            </tr>
            <tr>
              <td>keydown</td>
              <td>
                <h5>Function</h5>
                <p>Pass the callback function on keydown event of the component</p>
              </td>
            </tr>
            <tr>
              <td>callback</td>
              <td>
                <h5>Function</h5>
                <p>Returns input field value on every input change</p>
              </td>
            </tr>
            <tr>
              <td>autofocus</td>
              <td>
                <h5>Boolean</h5>
                <p>Will focus the dropdown input on mounting.</p>
                <p>Default value: false</p>
              </td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>
                <h5>Boolean</h5>
                <p>Will disable the input.</p>
                <p>Default value: false</p>
              </td>
            </tr>
            <tr>
              <td>async</td>
              <td>
                <h5>Boolean</h5>
                <p>Will enable asynchronous loading of lists.</p>
                <p>Default value: false</p>
                <p><strong>Note:</strong> Asynchronous loading will work by default also, but some functionality wouldn't work.</p>
              </td>
            </tr>
            <tr>
              <td>placeholder</td>
              <td>
                <h5>string</h5>
              </td>
            </tr>
            <tr>
              <td>containerClass</td>
              <td>
                <h5>className</h5>
                <p>Customize the style of the dropdown by passing custom class</p>
              </td>
            </tr>
            <tr>
              <td>inputClass</td>
              <td>
                <h5>className</h5>
                <p>Customize the style of the input field of the component by passing custom class</p>
              </td>
            </tr>
            <tr>
              <td>listClass</td>
              <td>
                <h5>className</h5>
                <p>Customize the style of the dropdown list of the component by passing custom class</p>
              </td>
            </tr>
            <tr>
              <td>loadingText</td>
              <td>
                <h5>string</h5>
                <p>Provide custom loading text for async loading</p>
              </td>
            </tr>
            <tr>
              <td>loadingClass</td>
              <td>
                <h5>string</h5>
                <p>Customize the style of the loading component by passing custom class.</p>
              </td>
            </tr>
          </tbody>
        </table>
<p>The response for all the functional props i.e focus, keydown, callback is: </p>
  <pre>
    {
      currentInput: '', // current input of the component
      event, // corresponding event
      multiSelect: [], // array of inputs. Present only if the prop multiselect is true
    }
  </pre>
