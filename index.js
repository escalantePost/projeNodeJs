const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send('API');
})

// List tasks
app.get('/tasks', async (req, res) => {
  const tarifas = await tasks.findAll()
  res.status(200).json({tarifas});
  })

// Create task
app.post('/tasks', async (req, res) => {
  const {description, done} = req.body
  if (description == null || done == null) {
    res.status(400).send('valores errados')
  }
  else {
    if (done == true || done == false) {
      const newtask = await tasks.create({
        description,
        done
      })
      res.status(200).send('cadastro salvo')
    }
    else {
      res.status(400).send('erro 400: valor no es valido')
    }
  }
})

// Show task
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const tarefas = await tasks.findByPk(taskId)
  if (tarefas) {
    res.status(200).json({tarefas})
    return;
  }
  if (isNaN(taskId)) {
    res.status(400).send('id invalido')
    return;
  }
  else {
    res.status(500).send('no hay tarifa');
  }
})

// Update task
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const task = await tasks.findOne({where: {id: taskId }});
  const { description, done } = req.body;
  if (isNaN(taskId)) {
    res.status(400).send('Id invalido, ingresar Id valido')
    return;
  }
  if (!task){
    res.status(500).send('tarifa no encontrada')
    return;
  }
  if(done == null) {
    task.set(req.body);
    await task.save();
    res.status(200).send('tarifa actualizada');
  }
  else {
    if (done == true || done == false){
      task.set(req.body);
      await task.save();
      res.status(200).send('tarifa actualizada');
    }
    else {
      res.status(400).send('el valo es invalidonnnnn')
    }
  }
})

// Delete task
app.delete('/tasks/:id', async (req, res )=> {
  const taskId = req.params.id
  const tarefas = await tasks.findByPk(taskId);

  if (tarefas) {
    await tasks.destroy({ where: {id: taskId }});
    res.status(200).send('tarifa borrada')
    return;
  }
  if (isNaN(taskId)) {
    res.status(400).send('tarifa no encontrada')
    return;
  }
  else {
    res.status(500).send('tarifa no existe')
    return;
  }
})

app.listen(3000, () => {
  console.log('Iniciando ExpressJS en el puerto 3000')
})