import React, { Component } from 'react';
import _ from 'lodash'
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import { GET_URLS_SUCCESS, GET_URLS_FAIL } from '../actions/types';
import { getUrls } from '../actions/urlActions';

import UrlItem from './UrlItem';

import {
    Container,
    Table,
    Segment,
    Dimmer,
    Loader
} from 'semantic-ui-react';


class UrlsList extends Component {
    state = {
        column: 'date',
        data: this.props.urls.urls,
        direction: 'descending',
        loading: true
    }

    componentDidMount() {
        this.props.getUrls();
    }

    componentDidUpdate(prevProps) {
        const { message } = this.props;
        const { urls } = this.props;

        if (message !== prevProps.message && (message.id === GET_URLS_SUCCESS || message.id === GET_URLS_FAIL)) {
            //remove loading animation
            this.setState({ loading: false });
        }

        if (urls !== prevProps.urls) {
            const { column, direction } = this.state;
            if (direction === 'descending') this.setState({ data: _.sortBy(this.props.urls.urls, column).reverse() });
            else this.setState({ data: _.sortBy(this.props.urls.urls, column) });
        }
    }

    handleSort = (clickedColumn) => () => {
        const { column, data, direction } = this.state;

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: _.sortBy(data, [clickedColumn]).reverse(),
                direction: 'descending',
            })

            return
        }

        this.setState({
            data: data.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    render() {
        const { column, data, direction, loading } = this.state;

        return (
            <Container style={{ margin: '1rem 0', overflowX: 'auto' }}>
                <Segment basic compact style={{ padding: '0', borderRadius: '5px', width: '100%' }}>
                    <Dimmer active={loading} inverted style={{ border: '1px solid rgba(34,36,38,.15' }}>
                        <Loader inverted>Loading URLs</Loader>
                    </Dimmer>
                    <Table
                        sortable
                        celled
                        size='small'
                        unstackable
                        style={{
                            margin: '0',
                            minWidth: '380px'
                        }}
                    >
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell
                                    sorted={column === 'urlCode' ? direction : null}
                                    onClick={this.handleSort('urlCode')}
                                >Link</Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={column === 'clicks' ? direction : null}
                                    onClick={this.handleSort('clicks')}
                                    textAlign='center'
                                    collapsing
                                >Clicks</Table.HeaderCell>
                                <Table.HeaderCell
                                    sorted={column === 'date' ? direction : null}
                                    onClick={this.handleSort('date')}
                                    textAlign='center'
                                    collapsing
                                >Created</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {_.map(data, ({ _id, date, urlCode, longUrl, clicks, accordionActive }) => (
                                <UrlItem key={urlCode} data={{ _id, date, urlCode, longUrl, clicks, accordionActive }} />
                            ))}
                        </Table.Body>
                    </Table>
                </Segment>
            </Container>
        )
    }
}

UrlsList.propTypes = {
    getUrls: PropTypes.func.isRequired,
    urls: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    urls: state.urls,
    message: state.message
})

export default connect(mapStateToProps, { getUrls })(UrlsList);