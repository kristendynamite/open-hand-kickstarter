import { Injectable } from '@angular/core';
import { Project } from './project.model';
// import { PROJECTS } from './mock-projects';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class ProjectService {
  projects: FirebaseListObservable<any[]>;

  constructor(private database: AngularFireDatabase) {
    this.projects = database.list('projects');
  }

  getProjects() {
    return this.projects;
  }

  addProject(newProject: Project) {
    this.projects.push(newProject);
  }

  getProjectById(projectId: string){
    return this.database.object('projects/' + projectId);
  }

  updateProject(localUpdatedProject){
    var projectEntryInFirebase = this.getProjectById(localUpdatedProject.$key);
    projectEntryInFirebase.update({title: localUpdatedProject.title,
                                description: localUpdatedProject.description,
                                person: localUpdatedProject.person, goal: localUpdatedProject.goal, current: localUpdatedProject.current});
  }

  deleteProject(localProjectToDelete){
    var projectEntryInFirebase = this.getProjectById(localProjectToDelete.$key);
    projectEntryInFirebase.remove();
  }

  updateAmount(localAmountToUpdate, projectId){
    var projectEntryInFirebase =
    this.getProjectById(projectId);
    var holder;
    projectEntryInFirebase.subscribe((snapshot) => {
      holder = snapshot;
    });
    holder.current = parseInt(holder.current);
    holder.current += localAmountToUpdate;
    projectEntryInFirebase.update(holder);
  }


}
