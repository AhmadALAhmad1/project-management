const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require('graphql'); //for creating types for all resources we have in our schema

//Mongoose Models
const Client = require('../models/Client');
const Project = require('../models/Project');


// Client type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({      // func that returns an object
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString },
    })
});

// Project type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args) {
                return Client.findById(parent.clientId) //parent is the project object, we can access the clientId from it and find the client with that id
            }
        }
    })
});
//Root query object
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: { //fields will pretain to queries
        // clients list
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent) {
                return Client.find();
            }
        },
        //single client
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } }, // to get single client we need to know the ID
            resolve(parent, args) {
                return Client.findById(args.id);
            }
        },
        // ----------------------------PROJECTS-----------------
        // projects list
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent) {
                return Project.find();
            }
        },
        //single project
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return projects.find(project => project.id === args.id);
                return Project.findById(args.id);
            }
        }
    }
});

// ------------------------------------`MUTATIONS`----------------------------

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        //------------------- Client---------------
        //Add CLient
        addClient: {
            type: ClientType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                phone: { type: new GraphQLNonNull(GraphQLString) }
            },
            // creating new client using mongoose model,
            // passing the args from the client field in the query above
            // and saving it to the database in the "resolve function" below and returning the "new client object"
            resolve(parent, args) {
                const client = new Client({
                    name: args.name,
                    email: args.email,
                    phone: args.phone
                });
                return client.save();
            }
        },
        //Delete Client
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Client.findByIdAndDelete(args.id);
            }
        },
        //------------------- Project---------------
        //Add project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            new: { value: 'Not started' },
                            progress: { value: 'In progress' },
                            completed: { value: 'Completed' },
                        },
                    }),
                    defaultValue: 'Not Started',
                },
                clientId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                const project = new Project({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });

                return project.save();
            },
        },

        //Delete Project
        deleteProject: {
            type: ProjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                return Project.findByIdAndDelete(args.id)
            }
        },

        //Update Project
        updateProject: {
            type: ProjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatusUpdate',
                        values: {
                            new: { value: 'Not started' },
                            progress: { value: 'In progress' },
                            completed: { value: 'Completed' },
                        },
                    }),
                },
            },
            resolve(parent, args) {
                return Project.findByIdAndUpdate(
                    args.id, //takes id of what we wanna update
                    {
                        $set: {
                            name: args.name,
                            description: args.description,
                            status: args.status
                        }
                    },
                    { new: true }
                )
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})

