import React from "react";
import { Button, Grid, Row, Col } from "react-bootstrap";

var $ = require('jquery');

export default class Hello extends React.Component {
    constructor(props) {
        super(props);
        this.state = {greeting: 'Hello ' + this.props.name};

        // This binding is necessary to make `this` work in the callback
        this.getPythonHello = this.getPythonHello.bind(this);
    }

    personaliseGreeting(greeting) {
        this.setState({greeting: greeting + ' ' + this.props.name + '!'});
    }

    getPythonHello() {
        $.get(window.location.href + 'hello', (data) => {
            console.log(data);
            this.personaliseGreeting(data);
        });
    }
	

    getSqLiteDataAndCreateCharts(){
         var startTime = new Date().getTime();

        $.getJSON(window.location.href + 'dataSqLite' , (dataArray) => {
			var currentTime = new Date().getTime();
			console.log("Query took " + (currentTime-startTime) + " ms");
			console.log("Number of rows: " + dataArray.length);
            //console.log('Data: ' + dataArray);
            //createCrossFilterAndCharts(dataArray);
        });
    }

    getMySqlDataAndCreateCharts(){
         var startTime = new Date().getTime();

        $.getJSON(window.location.href + 'dataMySql' , (dataArray) => {
			var currentTime = new Date().getTime();
			console.log("Query took " + (currentTime-startTime) + " ms");
			console.log("Number of rows: " + dataArray.length);
            //console.log('Data: ' + dataArray);
            //createCrossFilterAndCharts(dataArray);
        });
    }


    getDataAncCreateCharts() {

	    var startTime = new Date().getTime();

        $.getJSON(window.location.href + 'data' , (dataArray) => {  //?_id="1";color="red"'
			var currentTime = new Date().getTime();
			console.log("Query took " + (currentTime-startTime) + " ms");
			console.log("Number of rows: " + dataArray.length);
            //console.log('Data: ' + dataArray);
            createCrossFilterAndCharts(dataArray);
        });

        function createCrossFilterAndCharts(dataArray){

            //create instance of cross filter
			let cf = crossfilter(dataArray);

            //define dimensions and groups
            let scenarioDim = cf.dimension(d=> d.scenarioid);
            let scenarioGroupCount = scenarioDim.group().reduceCount();


            let superTypeDim = cf.dimension(d=> d.supertype);
            let superTypeGroupCount = superTypeDim.group().reduceCount();

            let typeDim = cf.dimension(d=> d.type);
            let typeGroupCount = typeDim.group().reduceCount();
            let typeGroupSum = typeDim.group().reduceSum(d => d.value);

            let subTypeDim = cf.dimension(d=> d.subtype);
            let subTypeGroupCount = typeDim.group().reduceCount();
            let subTypeGroupSum = typeDim.group().reduceSum(d => d.value);


            let paramDim = cf.dimension(d=> d.param);
            let paramGroupCount = paramDim.group().reduceCount();
            let paramGroupSum = paramDim.group().reduceSum(d => d.value);

            let subParamDim = cf.dimension(d=> d.subparam);
            let subParamGroupCount = subParamDim.group().reduceCount();
            let subParamGroupSum = subParamDim.group().reduceSum(d => d.value);


            let regionDim = cf.dimension(d=> d.region);
            let regionGroupCount = regionDim.group().reduceCount();
            let regionGroupSum = regionDim.group().reduceSum(d => d.value);


            let generationMethodDim = cf.dimension(d=> d.generationmethod);
            let generationMethodGroupCount = generationMethodDim.group().reduceCount();
            let generationMethodGroupSum = generationMethodDim.group().reduceSum(d => d.value);

            let constructionYearDim = cf.dimension(d=> d.constructionyear);
            let constructionYearDimGroupCount = constructionYearDim.group().reduceCount();
            let constructionYearDimGroupSum = constructionYearDim.group().reduceSum(d => d.value);

            let simYearDim = cf.dimension(d=> d.simyear);
            let simYearDimGroupCount = simYearDim.group().reduceCount();
            let simYearDimGroupSum = simYearDim.group().reduceSum(d => d.value);

            let hourDim = cf.dimension(d=> d.hour);
            let hourGroupSum = hourDim.group().reduceSum(d => d.value);

            d3.select('#charts')
                .append('div')
                .attr('id','scenario')

            barChart('#scenario')
				.xAxisLabel('Scenario')
				.x(d3.scaleBand())
				.dimension(scenarioDim)
				.yAxisLabel('Count')
				.group(scenarioGroupCount);

			dc.renderAll();


		    function barChart(elementSelector){

                let barChart = dc.barChart(elementSelector)
                    .width(200)
                    .height(200)
                    .xUnits(dc.units.ordinal)
                    .margins({top:10,left:30,right:15,bottom:35})
                    .barPadding(0.1)
                    .outerPadding(0.1)
                    .transitionDuration(500);

                    barChart.defineColors = function(colorScale){

                        this.renderlet(chart=>{
                            chart.selectAll('rect.bar')
                                 .each(function(d){

                                    let isSelected = this.classList.contains('selected');
                                    if(isSelected){
                                        d3.select(this).attr('style', 'fill: ' + colorScale(d.x) + ';stroke-width:2;stroke:#39ff14');

                                    } else {
                                        d3.select(this).attr('style', 'fill: ' + colorScale(d.x));
                                    }


                                 });

                        });
                        return this;
                    }

                    return barChart;
            }
    }

    }



    reduceAdd(previous, current) {

        if(current){
            if(current.value !== null){
                if(previous.sum === null){
                    previous.sum = current.value;
                    previous.count = 1;
                } else {
                    previous.sum += current.value;
                    previous.count += 1;

                }
            }
        }
        return previous;
    }

    reduceRemove(previous, current) {
        if(current){
            if(current.value !== null){
                if(previous.sum !== null){
                    previous.sum -= current.value;
                    previous.count -= 1;
                    if(previous.count === 0){
                        previous.sum = null;
                    }
                }
            }
        }
        return previous;
    }

    reduceInit(previous) {
            return {
                    sum: null,
                    count: 0
                   };
    }

    render () {
        return (
            <Grid>
                <Row>
                    <Col md={7} mdOffset={5}>
                        <h1>{this.state.greeting}</h1>
                        <hr/>
                    </Col>
                </Row>
                <Row>
                    <Col md={7} mdOffset={5}>

                        <div>
                            <Button bsSize="large" bsStyle="danger" onClick={this.getDataAncCreateCharts}>
                            Get MongoDb Data!
                            </Button>
                        </div>
                        <div>
                            <Button bsSize="large" bsStyle="danger" onClick={this.getSqLiteDataAndCreateCharts}>
                            Get SqLite Data!
                            </Button>
                        </div>
                        <div>
                            <Button bsSize="large" bsStyle="danger" onClick={this.getMySqlDataAndCreateCharts}>
                            Get MySql Data!
                            </Button>
                        </div>
                         <div>
                            <Button bsSize="large" bsStyle="danger" onClick={this.getPythonHello}>
                            Say Hello!
                            </Button>
                        </div>

                    </Col>
                </Row>
                <Row>
                    <Col>
                      <div id="charts" style={{fontFamily:'arial'}}>
                      </div>
                    </Col>
                </Row>

            </Grid>
        );
    }
}
