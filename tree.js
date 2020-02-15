// Recursive family tree generator.
// Written by Sean Evans 2008

// Constants
var Generations = 12;



var r,
    Format,
    StatusBox,
    Person = [],
    Family = [],
    ImgZoomOut,
    ImgZoomIn;



// Dimensions class
function Limits() {
  this.Left = 0;
  this.Right = 0;
  this.Filled = false;
}


// Status box class
function StsBx() {
  this.Frame = r.rect((Format.ClientWidth-Format.StatusBarWidth-40)/2, Format.ClientHeight/2-74, Format.StatusBarWidth+40, 102, 5);
  this.TopBar1 = r.rect((Format.ClientWidth-Format.StatusBarWidth-40)/2+1, Format.ClientHeight/2-74+1, Format.StatusBarWidth+40-2, 26, 5);
  this.TopBar2 = r.rect((Format.ClientWidth-Format.StatusBarWidth-40)/2+1, Format.ClientHeight/2-74+1+10, Format.StatusBarWidth+40-2, 16, 0);
  this.Title = r.text(Format.ClientWidth/2, Format.ClientHeight/2-60, '');
  this.Text = r.text(Format.ClientWidth/2, Format.ClientHeight/2-26, '');
  this.ProgressBox = r.rect((Format.ClientWidth-Format.StatusBarWidth-2)/2, Format.ClientHeight/2-9, Format.StatusBarWidth+2, 18, 0);
  this.ProgressBar = r.rect((Format.ClientWidth-Format.StatusBarWidth)/2, Format.ClientHeight/2-8, 1, 16, 0);

  this.TopBar1.attr({stroke: '#048', fill: '#048'});
  this.TopBar2.attr({stroke: '#048', fill: '#048'});
  this.Frame.attr({stroke: '#004', 'stroke-width': 2, fill: '#fff'});
  this.Title.attr({font: '14px Arial', fill: '#fff'});
  this.Text.attr({font: '12px Arial', fill: '#004'});
  this.ProgressBox.attr({stroke: '#008', 'stroke-width': 1, fill: '#fff'});
  this.ProgressBar.attr({stroke: '#08c', fill: '#08c'});

  this.Limit = 0;

  // Show method
  this.Show = function(Title) {
    this.TopBar1.show();
    this.TopBar2.show();
    this.Frame.show();
    this.Title.show();
    this.Text.show();
    this.ProgressBox.show();
    this.ProgressBar.show();
    this.Frame.toFront();
    this.TopBar1.toFront();
    this.TopBar2.toFront();
    this.Title.toFront();
    this.Text.toFront();
    this.ProgressBox.toFront();
    this.ProgressBar.toFront();
    this.Title.attr({text: Title});
  }

  // Retask method
  this.Retask = function(Text, Limit) {
    this.Text.attr({text: Text});
    this.Limit = Format.StatusBarWidth/Limit;
  }

  // Hide method
  this.Hide = function() {
    this.TopBar1.hide();
    this.TopBar2.hide();
    this.Frame.hide();
    this.Title.hide();
    this.Text.hide();
    this.ProgressBox.hide();
    this.ProgressBar.hide();
  }

  // Progress method
  this.Progress = function(Status) {
    this.ProgressBar.attr({width: this.Limit*Status});
  }
}


// Visual formatting class
function Fmt(ClientWidthInit, ClientHeightInit) {

  // Zoom level
  this.Zoom = 1;

  // Client dimensions
  this.ClientWidth  = ClientWidthInit;
  this.ClientHeight = ClientHeightInit;

  // Status bar width
  this.StatusBarWidth = 250;

  // Element visibility
  this.ShowTextFrameText = true;

  // Margins
  this.MarginFrameTitle = 6;
  this.MarginFrameText = 6;
  this.MarginFrameX = 12;
  this.MarginFrameBottom = 3;

  // Spacing
  this.SpaceSibling = 12;
  this.SpaceSpouse = 25;
  this.SpaceCousin = 49;
  this.SpaceGeneration = 28;

  // Corner radius
  this.CornerFrame = 5;

  // Selector radius
  this.SelectorRadius = 2;

  // Colours
  this.ColourMale   = '#5050a0';
  this.ColourFemale = '#a05050';
  this.ColourLine   = '#70a070';
  this.ColourFill   = '#ffffc0';

  // Fonts
  this.FontSizeFrameTitle = 10;
  this.FontSizeFrameText = 9;
  this.FontFrameTitle = 'Lucida Calligraphy';
  this.FontFrameText = 'Arial';//'Lucida Calligraphy';

  // Runtime variables
  this.FrameTextFontHeight = -1;
  this.FrameHeightMax = -1;
  this.FrameTitleFontHeight = -1;
  this.CentrePerson = -1;
}



// Person class
function PersonEntity(Generation, NameFirst, NameMiddle, NameLast, IsMale, Details, Famc, Fams) {

  // Attributes
  this.Generation = Generation;
  this.NameFirst = NameFirst;
  this.NameMiddle = NameMiddle;
  this.NameLast = NameLast;
  this.IsMale = IsMale;
  this.Details = Details;
  this.Famc = Famc;
  this.Fams = Fams;
  this.ScreenX = 0;
  this.ScreenY = 0;
  this.Visible = false;
  this.X = 0;

  // InitialiseParameters
  this.InitialiseParameters = function() {

    // Frame
    this.FrameWidth  = this.FrameTitle.getBBox().width+Format.MarginFrameX*2;
    if (Format.ShowTextFrameText == true) {
      if (this.FrameText.getBBox().width > this.FrameTitle.getBBox().width) {
        this.FrameWidth  = this.FrameText.getBBox().width+Format.MarginFrameX*2;
      }
    }
    this.Frame.attr({width: Format.Zoom*this.FrameWidth, height: Format.Zoom*Format.FrameHeightMax, r: Format.Zoom*Format.CornerFrame, 'stroke-width': Format.Zoom*2, fill: Format.ColourFill, stroke: Format.ColourLine, font: Format.FontSizeFrameText+'px '+Format.FontFrameText});

    // Selectors
    if (this.SelectorFams != false) {
      this.SelectorFams.attr({r: Format.Zoom*Format.SelectorRadius, 'stroke-width': Format.Zoom*2, fill: Format.ColourLine, stroke: Format.ColourLine});
    }
    if (this.SelectorFamc != false) {
      this.SelectorFamc.attr({r: Format.Zoom*Format.SelectorRadius, 'stroke-width': Format.Zoom*2, fill: Format.ColourLine, stroke: Format.ColourLine});
    }

    // Title
    if (this.IsMale == true) {
      this.FrameTitle.attr({fill: Format.ColourMale, font: Format.FontSizeFrameTitle*Format.Zoom+'px '+Format.FontFrameTitle});
    } else {
      this.FrameTitle.attr({fill: Format.ColourFemale, font: Format.FontSizeFrameTitle*Format.Zoom+'px '+Format.FontFrameTitle});
    }

    // Text
    this.FrameText.attr({fill: '#006', font: Format.FontSizeFrameText*Format.Zoom+'px '+Format.FontFrameText});
  }

  // Process
  this.Process = function() {

    // Person objects
    this.Frame = r.rect(0, 0, 0, 0, 0).hide();
    this.FrameTitle = r.text(0, 0, NameFirst+" "+NameLast).hide();
    this.FrameTitle.node.style.cursor = "pointer";
    this.FrameTitle.mousedown(FrameTitleClicked);
    this.FrameText = r.text(0, 0, Details).hide();
    if (Fams != -1) {
      this.SelectorFams = r.circle(0, 0, 0).hide();
      this.SelectorFams.node.style.cursor = "pointer";
      this.SelectorFams.mousedown(SelectorFamsClicked);
      this.SelectorFams.mouseover(SelectorOver);
      this.SelectorFams.mouseout(SelectorOut);
    } else {
      this.SelectorFams = false;
    }
    if (Famc != -1) {
      this.SelectorFamc = r.circle(0, 0, 0).hide();
      this.SelectorFamc.node.style.cursor = "pointer";
      this.SelectorFamc.mousedown(SelectorFamcClicked);
      this.SelectorFamc.mouseover(SelectorOver);
      this.SelectorFamc.mouseout(SelectorOut);
    } else {
      this.SelectorFamc = false;
    }

  }

  // Layout method
  this.Layout = function(X) {
    var Width = 0;
    if (this.Visible == true) {
      this.X = X;
      Width = this.FrameWidth;
    }
    return Width;
  };

  // Show method
  this.Show = function() {
    this.Frame.show();
    this.FrameTitle.show();
    if (Format.ShowTextFrameText == true) {
      this.FrameText.show();
    }
    if (this.SelectorFams != false) {
      this.SelectorFams.show();
    }
    if (this.SelectorFamc != false) {
      this.SelectorFamc.show();
    }

    if (this.Fams != -1) {
      Family[this.Fams].PathUnion1.show();
      Family[this.Fams].PathUnion2.show();
    }
    if (this.Famc != -1) {
      for (var i = 0; i < Family[this.Famc].Child.length; i++) {
        if (Person[Family[this.Famc].Child[i]] == this) {
          Family[this.Famc].PathChild[i].show();
        }
      }
    }
    this.Visible = true;
  }

  // Hide method
  this.Hide = function() {
    this.Frame.hide();
    this.FrameTitle.hide();
    if (Format.ShowTextFrameText == true) {
      this.FrameText.hide();
    }
    if (this.SelectorFams != false) {
      this.SelectorFams.hide();
    }
    if (this.SelectorFamc != false) {
      this.SelectorFamc.hide();
    }
    if (this.Fams != -1) {
      if (this.IsMale == true) {
        if (Person[Family[this.Fams].Mother].Visible == false) {
          Family[this.Fams].PathUnion1.hide();
          Family[this.Fams].PathUnion2.hide();
        }
      }
      else {
        if (Person[Family[this.Fams].Father].Visible == false) {
          Family[this.Fams].PathUnion1.hide();
          Family[this.Fams].PathUnion2.hide();
        }
      }
    }
    if (this.Famc != -1) {
      for (var i = 0; i < Family[this.Famc].Child.length; i++) {
        if (Person[Family[this.Famc].Child[i]] == this) {
          Family[this.Famc].PathChild[i].hide();
        }
      }
    }
    this.Visible = false;
  }

  // Render method
  this.Render = function(Disp, CentreDisplacement) {
    this.ScreenX = Format.Zoom*(Disp-CentreDisplacement+Format.ClientWidth/2-Person[Format.CentrePerson].FrameWidth/2+this.X-Person[Format.CentrePerson].X)+(Format.ClientWidth/2)*(1-Format.Zoom);
    this.ScreenY = Format.Zoom*(Format.ClientHeight/2-Format.FrameHeightMax/2+(this.Generation-Person[Format.CentrePerson].Generation)*(Format.FrameHeightMax+Format.SpaceGeneration))+(Format.ClientHeight/2)*(1-Format.Zoom);
    this.Frame.attr({x: this.ScreenX, y: this.ScreenY});
    this.Frame.attr({width: Format.Zoom*this.FrameWidth, height: Format.Zoom*Format.FrameHeightMax, r: Format.Zoom*Format.CornerFrame, 'stroke-width': Format.Zoom*2});
    this.FrameTitle.attr({x: this.ScreenX+Format.Zoom*this.FrameWidth/2, y: this.ScreenY+Format.Zoom*(Format.FrameTitleFontHeight/2+Format.MarginFrameTitle)});
    this.FrameTitle.attr({font: Format.FontSizeFrameTitle*Format.Zoom+'px '+Format.FontFrameTitle});
    if (Format.ShowTextFrameText == true) {
      this.FrameText.attr({font: Format.FontSizeFrameText*Format.Zoom+'px '+Format.FontFrameText});
      this.FrameText.attr({x: this.ScreenX+Format.Zoom*this.FrameWidth/2, y: this.ScreenY+Format.Zoom*(Format.FrameTitleFontHeight+2*Format.MarginFrameTitle+Format.FrameTextFontHeight/2)});
    }
    // Render spouse selector
    if (this.SelectorFams != false) {
      if (this.IsMale == true)
        this.SelectorFams.attr({cx: this.ScreenX+Format.Zoom*this.FrameWidth, cy: this.ScreenY+Format.Zoom*Format.FrameHeightMax/2, r: Format.Zoom*Format.SelectorRadius, 'stroke-width': Format.Zoom*2});
      else
        this.SelectorFams.attr({cx: this.ScreenX, cy: this.ScreenY+Format.Zoom*Format.FrameHeightMax/2, r: Format.Zoom*Format.SelectorRadius, 'stroke-width': Format.Zoom*2});
    }
    // Render child path and selector
    if (this.SelectorFamc != false) {
      var  Path, X1, Y1, Y2, X3, Y3, Idx;
      for (var i = 0; i < Family[this.Famc].Child.length; i++) {
        if (Person[Family[this.Famc].Child[i]] == this)
          Idx = i;
      }
      X3 = this.ScreenX+Format.Zoom*this.FrameWidth/2;
      Y3 = this.ScreenY;
      if (Person[Family[this.Famc].Father].Visible == true) {
        X1 = Person[Family[this.Famc].Father].ScreenX+Format.Zoom*(Person[Family[this.Famc].Father].FrameWidth+Format.SpaceSpouse/2);
        Y1 = Person[Family[this.Famc].Father].ScreenY+Format.Zoom*Format.FrameHeightMax/2;
        Y2 = Person[Family[this.Famc].Father].ScreenY+Format.Zoom*(Format.FrameHeightMax+Format.SpaceGeneration/2);
        Path = 'M '+X1+' '+Y1+' L '+X1+' '+Y2+' L '+X3+' '+Y2+' L '+X3+' '+Y3;
      }
      else {
        Y2 = this.ScreenY-Format.Zoom*Format.SpaceGeneration/3;
        Path = 'M '+X3+' '+Y2+' L '+X3+' '+Y3;
      }
      Family[this.Famc].PathChild[Idx].attr({'stroke-width': Format.Zoom*2, path: Path});
      this.SelectorFamc.attr({cx: this.ScreenX+Format.Zoom*this.FrameWidth/2, cy: this.ScreenY, r: Format.Zoom*Format.SelectorRadius, 'stroke-width': Format.Zoom*2});
    }
  }

}



// Family class
function FamilyEntity(Father, Mother, Child) {
  this.Father = Father;
  this.Mother = Mother;
  this.Child = Child;

  // InitialiseParameters
  this.InitialiseParameters = function() {
    this.PathUnion1.attr({stroke: Format.ColourLine, 'stroke-width': Format.Zoom*4});
    this.PathUnion2.attr({'stroke-width': Format.Zoom*2, stroke: '#fff'});
    if (this.Child.length != 0) {
      for (var j = 0; j < this.Child.length; j++) {
        this.PathChild[j].attr({'stroke-width': Format.Zoom*2, stroke: Format.ColourLine});
      }
    }
  }

  // Process
  this.Process = function() {
    if (Father != -1) {
      this.PathUnion1 = r.path().hide();
      this.PathUnion2 = r.path().hide();
      this.PathUnion2.toBack();
      this.PathUnion1.toBack();
      this.PathChild = [];
      if (Child.length != 0) {
        for (var i = 0; i < Child.length; i++) {
          this.PathChild[i] = r.path().hide();
          this.PathChild[i].toBack();
        }
      }
    }
    this.Visible = false;
    this.Displacement = 0;
  }

  // Show method
  this.Show = function() {
    Person[this.Mother].Show();
    Person[this.Father].Show();
    for (var i = 0; i < this.Child.length; i++) {
      Person[this.Child[i]].Show();
    }
    this.Visible = true;
  }

  // Hide method
  this.Hide = function(SourceIdx) {
    for (var i = 0; i < this.Child.length; i++) {
      if (SourceIdx != this.Child[i]) {
        if (Person[this.Child[i]].Fams != -1) {
          if (Family[Person[this.Child[i]].Fams].Visible == true) {
            Family[Person[this.Child[i]].Fams].Hide(this.Child[i]);
          }
        }
        Person[this.Child[i]].Hide();
      }
    }

    if (this.Mother != -1) {
      if (SourceIdx != this.Mother) {
        if (Person[this.Mother].Famc != -1) {
          if (Family[Person[this.Mother].Famc].Visible == true) {
            Family[Person[this.Mother].Famc].Hide(this.Mother);
          }
        }
        if (Person[this.Mother].Visible == true) {
          Person[this.Mother].Hide();
        }
      }
    }

    if (this.Father != -1) {
      if (SourceIdx != this.Father) {
        if (Person[this.Father].Famc != -1) {
          if (Family[Person[this.Father].Famc].Visible == true) {
            Family[Person[this.Father].Famc].Hide(this.Father);
          }
        }
        if (Person[this.Father].Visible == true) {
          Person[this.Father].Hide();
        }
      }
    }

    this.Visible = false;
  }

  // Render method
  this.Render = function() {

    this.PathUnion1.attr({'stroke-width': Format.Zoom*4});
    this.PathUnion2.attr({'stroke-width': Format.Zoom*2});

    if (this.Visible == true) {
      var Path1 = 'M '+(Person[this.Father].ScreenX+Format.Zoom*Person[this.Father].FrameWidth)+' '+(Person[this.Father].ScreenY+Format.Zoom*Format.FrameHeightMax/2)+' L '+(Person[this.Mother].ScreenX)+' '+(Person[this.Mother].ScreenY+Format.Zoom*Format.FrameHeightMax/2);
      this.PathUnion1.attr({path: Path1});
      this.PathUnion2.attr({path: Path1});
    }

    else {
      var Path1 = 'M '+(Person[this.Father].ScreenX+Format.Zoom*Person[this.Father].FrameWidth)+' '+(Person[this.Father].ScreenY+Format.Zoom*Format.FrameHeightMax/2)+' L '+(Person[this.Mother].ScreenX)+' '+(Person[this.Mother].ScreenY+Format.Zoom*Format.FrameHeightMax/2);
      if (Person[this.Father].Visible == true) {
        Path1 = 'M '+(Person[this.Father].ScreenX+Format.Zoom*Person[this.Father].FrameWidth)+' '+(Person[this.Father].ScreenY+Format.Zoom*Format.FrameHeightMax/2)+' L '+(Person[this.Father].ScreenX+Format.Zoom*(Person[this.Father].FrameWidth+Format.SpaceSpouse/2))+' '+(Person[this.Father].ScreenY+Format.Zoom*Format.FrameHeightMax/2);
      } else {
        Path1 = 'M '+(Person[this.Mother].ScreenX-Format.Zoom*Format.SpaceSpouse/2)+' '+(Person[this.Mother].ScreenY+Format.Zoom*Format.FrameHeightMax/2)+' L '+(Person[this.Mother].ScreenX)+' '+(Person[this.Mother].ScreenY+Format.Zoom*Format.FrameHeightMax/2)
      }
      this.PathUnion1.attr({path: Path1});
      this.PathUnion2.attr({path: Path1});

    }

  }

}



// Sub-tree layout function
function SubtreeLayout(FamIdx) {

  var LhsDims = [], RhsDims, Centre, d, D = 0, bFound, Width, FamGen;

  // Initialise generation
  if (Family[FamIdx].Father != -1) {
    FamGen = Person[Family[FamIdx].Father].Generation+1;
  } else {
    FamGen = Person[Family[FamIdx].Child[0]].Generation;
  }

  // Initialise lhs dimensions array
  for (var j = 0; j < Generations; j++) {
    LhsDims[j] = new Limits();
  }
  Family[FamIdx].Displacement = 0;

  // Recursive function calls
  for (var i = 0; i < Family[FamIdx].Child.length; i++) {

    if ((LhsDims[FamGen].Filled == true) && (Person[Family[FamIdx].Child[i]].Visible == true)) {
      LhsDims[FamGen].Right += Format.SpaceSibling;
    }

    if (Person[Family[FamIdx].Child[i]].Fams == -1 ) {

      // Unmarried child
      Width = Person[Family[FamIdx].Child[i]].Layout(LhsDims[FamGen].Right);
      if (Width != 0) {
        LhsDims[FamGen].Right += Width;
        LhsDims[FamGen].Filled = true;
      }

    } else {

      // Married child
      if (Family[Person[Family[FamIdx].Child[i]].Fams].Child.length == 0) {

        Family[Person[Family[FamIdx].Child[i]].Fams].Displacement = 0;

        // No children - simply append parents
        Width = Person[Family[Person[Family[FamIdx].Child[i]].Fams].Father].Layout(LhsDims[FamGen].Right);
        if (Width != 0) {
          LhsDims[FamGen].Right += Width;
          LhsDims[FamGen].Filled = true;
        }
        if (Person[Family[Person[Family[FamIdx].Child[i]].Fams].Father].Visible == true) {
          LhsDims[FamGen].Right += Format.SpaceSpouse/2;
        }
        if (Person[Family[Person[Family[FamIdx].Child[i]].Fams].Mother].Visible == true) {
          LhsDims[FamGen].Right += Format.SpaceSpouse/2;
        }
        Width = Person[Family[Person[Family[FamIdx].Child[i]].Fams].Mother].Layout(LhsDims[FamGen].Right);
        if (Width != 0) {
          LhsDims[FamGen].Right += Width;
          LhsDims[FamGen].Filled = true;
        }

      } else {

        // Married with children - Layout childs subtree
        RhsDims = SubtreeLayout(Person[Family[FamIdx].Child[i]].Fams);
        // Centralise parents above children
        if ((Person[Family[Person[Family[FamIdx].Child[i]].Fams].Father].Visible == true) && (Person[Family[Person[Family[FamIdx].Child[i]].Fams].Mother].Visible == true)) {
          Centre = (RhsDims[FamGen+1].Left+RhsDims[FamGen+1].Right-Format.SpaceCousin)/2;
          RhsDims[FamGen].Left  = Centre-Format.SpaceSpouse/2-Person[Family[Person[Family[FamIdx].Child[i]].Fams].Father].Layout(Centre-Person[Family[Person[Family[FamIdx].Child[i]].Fams].Father].FrameWidth-Format.SpaceSpouse/2);
          RhsDims[FamGen].Right = Centre+Format.SpaceSpouse/2+Person[Family[Person[Family[FamIdx].Child[i]].Fams].Mother].Layout(Centre+Format.SpaceSpouse/2);
          RhsDims[FamGen].Filled = true;
        }
        else {
          Width = Person[Family[Person[Family[FamIdx].Child[i]].Fams].Father].Layout(LhsDims[FamGen].Right);
          if (Width != 0) {
            LhsDims[FamGen].Right += Width;
            LhsDims[FamGen].Filled = true;
          }
          if ((Person[Family[Person[Family[FamIdx].Child[i]].Fams].Father].Visible == true) || (Person[Family[Person[Family[FamIdx].Child[i]].Fams].Mother].Visible == true)) {
            LhsDims[FamGen].Right += Format.SpaceSpouse/2;
          }
          Width = Person[Family[Person[Family[FamIdx].Child[i]].Fams].Mother].Layout(LhsDims[FamGen].Right);
          if (Width != 0) {
            LhsDims[FamGen].Right += Width;
            LhsDims[FamGen].Filled = true;
          }
        }
        // Calculate required displacement, D, of rhs subtree.
        D = 0;
        for (var j = 0; (j < Generations) && (D == 0); j++) {
          if ((LhsDims[j].Filled == true) && (RhsDims[j].Filled == true)) {
            d = LhsDims[j].Right-RhsDims[j].Left;
            bFound = true;
            for (var k = 0; k < Generations; k++) {
              if ((LhsDims[k].Filled == true) && (RhsDims[k].Filled == true)) {
                if (LhsDims[k].Right > (RhsDims[k].Left+d)) {
                  bFound = false;
                }
              }
            }
            if (bFound == true) {
              D = d;
            }
          }
        }
        // LhsDims.Right = RhsDims.Right + D.
        for (var j = 0; j < Generations; j++) {
          if (RhsDims[j].Filled == true) {
            LhsDims[j].Right = RhsDims[j].Right+D;
            if (LhsDims[j].Filled == false) {
              LhsDims[j].Left = RhsDims[j].Left+D;
            }
            LhsDims[j].Filled = true;
          }
        }
        // Translate rhs subtree by D.
        Family[Person[Family[FamIdx].Child[i]].Fams].Displacement = D;

      }

    }
  }


  // Add cousin spacing
  if (LhsDims[FamGen].Filled == true) {
    LhsDims[FamGen].Right += Format.SpaceCousin;
  }

  return LhsDims;
}



// Centre finding function
function FindCentre() {
  var PersonIdx = Format.CentrePerson,
      CentreDisplacement = 0;

  while (PersonIdx != -1) {

    // Add displacement
    if (Person[PersonIdx].Fams != -1) {
      CentreDisplacement += Family[Person[PersonIdx].Fams].Displacement;
    }

    // Navigate upwards
    if (Person[PersonIdx].Famc != -1) {
      if (Person[Family[Person[PersonIdx].Famc].Father].Visible == true)
        PersonIdx = Family[Person[PersonIdx].Famc].Father;
      else
        PersonIdx = -1;
    } else if (Person[PersonIdx].Fams != -1) {

      if (Person[PersonIdx].IsMale == true) {
        PersonIdx = Family[Person[PersonIdx].Fams].Mother;
      } else {
        PersonIdx = Family[Person[PersonIdx].Fams].Father;
      }
      if (Person[PersonIdx].Famc != -1) {
        PersonIdx = Family[Person[PersonIdx].Famc].Father;
      } else {
        PersonIdx = -1;
      }

    } else {
      PersonIdx = -1;
    }

  }

  return CentreDisplacement;
}



// Subtree rendering function
function SubtreeRender(FamIdx, Disp, CentreDisplacement) {

  // Render parents
  if (Family[FamIdx].Father != -1) {
    if (Person[Family[FamIdx].Father].Visible == true) {
      Person[Family[FamIdx].Father].Render(Disp+Family[FamIdx].Displacement, CentreDisplacement);
    }
  }
  if (Family[FamIdx].Mother != -1) {
    if (Person[Family[FamIdx].Mother].Visible == true) {
      Person[Family[FamIdx].Mother].Render(Disp+Family[FamIdx].Displacement, CentreDisplacement);
    }
  }

  // Render children
  for (var i = 0; i < Family[FamIdx].Child.length; i++) {
    if (Person[Family[FamIdx].Child[i]].Fams == -1) {
      if (Person[Family[FamIdx].Child[i]].Visible == true) {
        Person[Family[FamIdx].Child[i]].Render(Disp+Family[FamIdx].Displacement, CentreDisplacement);
      }
    } else {
      SubtreeRender(Person[Family[FamIdx].Child[i]].Fams, Disp+Family[FamIdx].Displacement, CentreDisplacement);
      if (Person[Family[FamIdx].Child[i]].IsMale == true) {
        if (Person[Family[Person[Family[FamIdx].Child[i]].Fams].Mother].Famc != -1) {
          Family[Person[Family[Person[Family[FamIdx].Child[i]].Fams].Mother].Famc].Render();
        }
      } else {
        if (Person[Family[Person[Family[FamIdx].Child[i]].Fams].Father].Famc != -1) {
          Family[Person[Family[Person[Family[FamIdx].Child[i]].Fams].Father].Famc].Render();
        }
      }
    }
  }

  if (FamIdx > 0) {
    Family[FamIdx].Render();
  }

  return;
}



// Spouse selector clicked event handler
function SelectorFamsClicked() {
  var PersonClicked;
  // Find selector
  for (var i = 0; i < Person.length; i++) {
    if (Person[i].SelectorFams == this) {
      PersonClicked = i;
      i = Person.length-1;
    }
  }
  // Show or hide family
  if (Family[Person[PersonClicked].Fams].Visible == false) {
    Family[Person[PersonClicked].Fams].Show();
  } else {
    Family[Person[PersonClicked].Fams].Hide(PersonClicked);
    if (Person[Format.CentrePerson].Visible == false)
      Format.CentrePerson = PersonClicked;
    if (Person[Family[0].Child[0]].Visible == false)
      Family[0].Child[0] = PersonClicked;
  }
  SubtreeLayout(0);
  SubtreeRender(0, 0, FindCentre());
  this.attr({r: Format.Zoom*Format.SelectorRadius});
}



// Parent selector clicked event handler
function SelectorFamcClicked() {
  var PersonClicked;
  // Find selector
  for (var i = 0; i < Person.length; i++) {
    if (Person[i].SelectorFamc == this) {
      PersonClicked = i;
      i = Person.length-1;
    }
  }

  // Show or hide family
  if (Family[Person[PersonClicked].Famc].Visible == false) {

    // Hide spouses family if visible
    if (Person[PersonClicked].Fams != -1) {

      if (Person[PersonClicked].IsMale == true) {

        if (Person[Family[Person[PersonClicked].Fams].Mother].Famc != -1) {
          if (Family[Person[Family[Person[PersonClicked].Fams].Mother].Famc].Visible == true) {
            Family[Person[Family[Person[PersonClicked].Fams].Mother].Famc].Hide(Family[Person[PersonClicked].Fams].Mother);
          }
        }

      } else {

        if (Person[Family[Person[PersonClicked].Fams].Father].Famc != -1) {
          if (Family[Person[Family[Person[PersonClicked].Fams].Father].Famc].Visible == true) {
            Family[Person[Family[Person[PersonClicked].Fams].Father].Famc].Hide(Family[Person[PersonClicked].Fams].Father);
          }
        }

      }

    }

    Family[0].Child[0] = Family[Person[PersonClicked].Famc].Father;

    if (Person[Format.CentrePerson].Visible == false) {
      Format.CentrePerson = PersonClicked;
    }
    Family[Person[PersonClicked].Famc].Show();
    SubtreeLayout(0);
    SubtreeRender(0, 0, FindCentre());

  } else {

    Family[Person[PersonClicked].Famc].Hide(PersonClicked);
    if (Person[Format.CentrePerson].Visible == false) {
      Format.CentrePerson = PersonClicked;
    }
    if (Person[Family[0].Child[0]].Visible == false) {
      Family[0].Child[0] = PersonClicked;
    }

    SubtreeLayout(0);
    SubtreeRender(0, 0, FindCentre());
  }

  this.attr({r: Format.Zoom*Format.SelectorRadius});
}





// Frame title clicked event handler
function FrameTitleClicked() {
  var Idx;
  // Find selector
  for (var i = 0; i < Person.length; i++) {
    if (Person[i].FrameTitle == this) {
      Idx = i;
      i = Person.length-1;
    }
  }

  // Show or hide family
  Format.CentrePerson = Idx;
  SubtreeRender(0, 0, FindCentre());
}



// Selector mouse over event
function SelectorOver() {
  this.attr({r: Format.Zoom*Format.SelectorRadius*2});
}



// Selector mouse out event
function SelectorOut() {
  this.attr({r: Format.Zoom*Format.SelectorRadius});
}



function ZoomOut() {
  Format.Zoom = Format.Zoom * 0.9;
  SubtreeRender(0, 0, FindCentre());
}



function ZoomIn() {
  Format.Zoom = Format.Zoom * 1.1;
  SubtreeRender(0, 0, FindCentre());
}



function AppendPerson(Generation, NameFirst, NameMiddle, NameLast, IsMale, BirthDate, DeathDate, Famc, Fams) {
  var Dates = BirthDate+"-"+DeathDate;
  if (Dates == "-")
  Dates = "";
  Person[Person.length]  = new PersonEntity(Generation, NameFirst, NameMiddle, NameLast, IsMale, Dates, Famc, Fams);
}


function AppendFamily(Father, Mother, Children) {
  Family[Family.length]  = new FamilyEntity(Father, Mother, Children);
}



function PersonProcess(Index) {
  if (Index == 0)
    StatusBox.Retask('Processing individuals', Person.length);
  Person[Index].Process();
  StatusBox.Progress(Index);
  Index++;
  if (Index < Person.length) {
    setTimeout("PersonProcess("+Index+")", 1);
  } else {
    StatusBox.Index = 0;
    FamilyProcess(0);
  }
}

function FamilyProcess(Index) {
  if (Index == 0)
    StatusBox.Retask('Processing families', Family.length);
  Family[Index].Process();
  StatusBox.Progress(Index);
  Index++;
  if (Index < Family.length)
    setTimeout("FamilyProcess("+Index+")", 1);
  else {
    Format.CentrePerson = 227;
    Person[Format.CentrePerson].Show();
    StatusBox.Index = 0;
    PersonVisualsProcess(0);
  }
}

function PersonVisualsProcess(Index) {
  if (Index == 0)
    StatusBox.Retask('Calculating graphical parameters (individuals)', Person.length);
  Person[Index].InitialiseParameters();
  StatusBox.Progress(Index);
  Index++;
  if (Index < Person.length)
    setTimeout("PersonVisualsProcess("+Index+")", 1);
  else {
    Format.FrameTitleFontHeight = Person[0].FrameTitle.getBBox().height;
    Format.FrameTextFontHeight = Person[0].FrameText.getBBox().height;
    Format.FrameHeightMax = Format.FrameTitleFontHeight+2*Format.MarginFrameTitle+Format.MarginFrameBottom;
    if (Format.ShowTextFrameText == true) {
      Format.FrameHeightMax += Format.FrameTextFontHeight+Format.MarginFrameText;
    }
    FamilyVisualsProcess(1);
  }
}

function FamilyVisualsProcess(Index) {
  if (Index == 1)
    StatusBox.Retask('Calculating graphical parameters (families)', Family.length);
  Family[Index].InitialiseParameters();
  StatusBox.Progress(Index);
  Index++;
  if (Index < Family.length)
    setTimeout("FamilyVisualsProcess("+Index+")", 1);
  else {
    Family[0].Child[0] = Format.CentrePerson;
    SubtreeLayout(0);
    SubtreeRender(0, 0, FindCentre());
    StatusBox.Hide();
  }
}
