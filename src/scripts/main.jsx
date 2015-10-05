;(()=> {

	let data = [
		{
			title: 'title one',
			content: 'content one'
		},
		{
			title: 'title two',
			content: 'content two'
		}
	];

	let NewsItem = React.createClass({
		getInitialState() {
			return null;
		},
	
		render() {
			return(
				<li className='news-item'>{this.props.title} : {this.props.content}</li>
			);
		}

	});

	let NewsList = React.createClass({
		getInitialState() {
			return {};
		},
		render() {
			let items = this.props.data.map((node)=> {
				return (
					<NewsItem title={node.title} content={node.content} />
				);
			});
			return(
				<ul>
					{items}
				</ul>
			);
		}

	});
	
	React.render(<NewsList data={data} />, document.getElementById('content'));

})();
