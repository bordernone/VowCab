import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Homepage from './components/homepage';
import View from './components/view';
import ViewAllEntries from './components/viewAllEntries';

function App() {
	return (
		<div className="App row">
			<BrowserRouter>
				<Route exact path="/" component={Homepage} />
				<Route exact path="/view" component={ViewAllEntries} />
				<Route path="/view/:id" component={View} />
			</BrowserRouter>
		</div>
	);
}

export default App;
