import { Template } from 'meteor/templating';
import { FormData } from '../../../../lib/database/FormData'
import { HashHardware } from '../../../../lib/database/HashHardware'
import { HashAlgorithm } from '../../../../lib/database/HashAlgorithm'
import { HashUnits } from '../../../../lib/database/HashUnits'
import { FlowRouter } from 'meteor/kadira:flow-router'

import '../../layouts/MainBody.html'
import './addHashpower.template.html'

Template.addHashpower.onCreated(function() {
	this.autorun(() => {
		this.subscribe('formdata')
		this.subscribe('hashhardware')
		this.subscribe('hashalgorithm')
		this.subscribe('hashunits')
	})

	this.addHw = new ReactiveVar(false)
	this.addAlgo = new ReactiveVar(false)
	this.addUnit = new ReactiveVar(false)
})

Template.addHashpower.helpers({
	hwDevices: () => HashHardware.find({}).fetch(),
	hwAlgo: () => HashAlgorithm.find({}).fetch(),
	units: () => HashUnits.find({}).fetch(),
	addHw: () => Template.instance().addHw.get() ? 'block' : 'none',
	addAlgo: () => Template.instance().addAlgo.get() ? 'block' : 'none',
	addUnit: () => Template.instance().addUnit.get() ? 'block' : 'none'
})

Template.addHashpower.events({
	'click #js-add-hw': (event, templateInstance) => {
		event.preventDefault()

		templateInstance.addHw.set(!templateInstance.addHw.get())
	},
	'click #js-add-algo': (event, templateInstance) => {
		event.preventDefault()

		templateInstance.addAlgo.set(!templateInstance.addAlgo.get())
	},
	'click #js-add-unit': (event, templateInstance) => {
		event.preventDefault()

		templateInstance.addUnit.set(!templateInstance.addUnit.get())
	},
	'click #js-add': (event, templateInstance) => {
		event.preventDefault()

		const f = (device, algo, unit) => {
			Meteor.call('addHashpower', $('#js-hw-cat').val(), device, algo, $('#js-hr').val() || 0, unit, $('#js-pc').val(), (err, data) => {
				if (!err) {
					FlowRouter.go('/hashpower')
				} else {
					sAlert.error(err.reason)
				}
			})
		} // to prevent redundant code, we simply create a function that will be called in both cases with a different parameter

		f($('#js-hw-new').val() || $('#js-hw-dev').val(), $('#js-algo-new').val() || $('#js-algo').val(), $('#js-unit-new').val() || $('#js-unit').val())
	}
})