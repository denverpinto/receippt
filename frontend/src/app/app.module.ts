import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import {DragDropModule} from '@angular/cdk/drag-drop';
import {DialogModule} from '@angular/cdk/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ClipboardModule} from '@angular/cdk/clipboard';

import { HeaderComponent } from './header/header.component';
import { MasspartContentComponent } from './masspart-content/masspart-content.component';
import { CataloguedSlidesComponent } from './catalogued-slides/catalogued-slides.component';
import { ChosenSlidesComponent } from './chosen-slides/chosen-slides.component';
import { ViewSlideComponent } from './dialogs/view-slide/view-slide.component';
import { DeleteMasspartComponent } from './dialogs/delete-masspart/delete-masspart.component';
import { AddMasspartComponent } from './dialogs/add-masspart/add-masspart.component';
import { RenameMasspartComponent } from './dialogs/rename-masspart/rename-masspart.component';
import { TemplateSelectorComponent } from './dialogs/template-selector/template-selector.component';
import { DownloadReceipptComponent } from './dialogs/download-receippt/download-receippt.component';
import { HighlightPipe } from './pipes/highlight.pipe';
import { PluralPipe } from './pipes/plural.pipe';
import { RectSkeComponent } from './rect-ske/rect-ske.component';
import { SkeletonDirective } from './skeleton.directive';
import { DownScreenComponent } from './down-screen/down-screen.component';
import { FilterSlideComponent } from './dialogs/filter-slide/filter-slide.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MasspartContentComponent,
    CataloguedSlidesComponent,
    ChosenSlidesComponent,
    ViewSlideComponent,
    DeleteMasspartComponent,
    AddMasspartComponent,
    RenameMasspartComponent,
    TemplateSelectorComponent,
    DownloadReceipptComponent,
    HighlightPipe,
    PluralPipe,
    RectSkeComponent,
    SkeletonDirective,
    DownScreenComponent,
    FilterSlideComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    DialogModule,
    MatSnackBarModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ClipboardModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
