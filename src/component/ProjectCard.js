import React, {Component} from "react";
import './project.scss';
import {ApolloClient, InMemoryCache, gql, createHttpLink, ApolloProvider, useQuery} from "@apollo/client";
import {setContext} from '@apollo/client/link/context';

require('dotenv').config();

const accessToken = process.env.REACT_APP_GIT_TOKEN;

const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql'
});

const authLink = setContext((_, {headers}) => {
    return {
        headers: {
            ...headers,
            authorization: accessToken ? `bearer ${accessToken}` : '',
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

function Project() {
    const {loading, error, data} = useQuery(gql`
         query {
              viewer {
                  name
                  repositories(last: 2) {
                      edges {
                          node {
                              id
                              name
                              createdAt
                              description
                              openGraphImageUrl
                              languages(first: 10) {
                                  edges {
                                      size
                                      node {
                                          id
                                          name
                                          color
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
         }
    `);

    if (loading) return <p>Loading Github projects...</p>
    if (error) return <p>Error :( could not get Github projects</p>;
    const d = data.viewer;
    return (
        <div className="projects">
            {d.repositories.edges.map(repo => (
                <div key={repo.node.id} className="project">
                    <div>
                        <h1 className="project-name">{repo.node.name}</h1>
                        <img src={repo.node.openGraphImageUrl} alt="Project's img"/>
                        <p>{repo.node.description}</p>
                        <p>{repo.node.createdAt}</p>
                        <div className="lang">
                            {repo.node.languages.edges.map(lang => (
                                <div key={lang.node.id}>
                                    <p>{lang.size}</p>
                                    <p style={{color: lang.node.color}}>{lang.node.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default class ProjectCard extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <div className="project-container">
                    <Project/>
                </div>
            </ApolloProvider>
        )
    }
}