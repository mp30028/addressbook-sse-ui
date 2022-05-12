import React, { Component } from 'react';

const API_BASE_URL = 	"/api/persons/get-all";

class App extends Component {
	state = {persons: []};
	eventSource = new EventSource('http://localhost:8080/sse/persons');
	
  updateState = (eventData) => {
	let eventDataObject = JSON.parse(eventData);
	let person = eventDataObject.person;
	if(eventDataObject.eventType === 'UPDATE'){
		this.setState({persons: this.state.persons.map(p => {return ((p.id === person.id) ? person : p)})});
	}else if(eventDataObject.eventType === 'CREATE'){
		this.setState(({persons: [...this.state.persons, person]}));
	}else if(eventDataObject.eventType === 'DELETE'){
		this.setState({persons: this.state.persons.filter(function(p) {return (p.id === person.id ? null : p)})});
	}
  };
  

  
  async componentDidMount() {
	const response =  await fetch(API_BASE_URL, { mode: "no-cors" });
	const body = await response.json();
	this.setState({persons: body});
	    this.eventSource.onmessage = (e) => {
            console.log(e);
            this.updateState(e.data);
        };
    console.log("componentDidMount Triggered");
//	this.eventSource.addEventListener('message', (e) => this.updateState(e.data));
  };
  






  render() {
    return (
      <div>
		<div>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Firstname</th>
						<th>Lastname</th>
						<th>Date of Birth</th>
					</tr>
				</thead>
				<tbody>
					{
						
						this.state.persons.map(
							person =>
								<tr key={person.key}>
									<td>{person.id}</td>
									<td>{person.firstname}</td>
									<td>{person.lastname}</td>
									<td>{person.dateOfBirth}</td>
								</tr>
						)
					}
				</tbody>
			</table>
		</div>
      </div>
    );
  }
}

export default App;