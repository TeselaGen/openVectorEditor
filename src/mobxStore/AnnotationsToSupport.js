import { makeAutoObservable } from "mobx"

export default class AnnotationsToSupport{
  constructor() {
    makeAutoObservable(this)
  }
  parts = true
  features = true
  translations = true
  primers = true
  cutsites = true
  orfs = true
  warnings = true
  assemblyPieces = true
  lineageAnnotations = true
}