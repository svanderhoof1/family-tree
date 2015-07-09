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


// Main window.onload event handler
window.onload = function () {

  // Initialise visual formatting
  Format = new Fmt(window.innerWidth-4, window.innerHeight-4);  
 
  // Initialise Raphael
  r = Raphael("holder", Format.ClientWidth, Format.ClientHeight);                                                  

  // Status box
  StatusBox = new StsBx();
    
  ImgZoomOut = r.image("zoomout.png", 3, 3, 26, 27);
  ImgZoomOut.node.style.cursor = "pointer";
  ImgZoomOut.mousedown(ZoomOut);  
  
  ImgZoomIn = r.image("zoomin.png", 32, 3, 26, 27);
  ImgZoomIn.node.style.cursor = "pointer";
  ImgZoomIn.mousedown(ZoomIn);       
   
AppendPerson(7, "Horace", "Leslie", "Bartlett", true, "1909", "1969", 1, 2);
AppendPerson(8, "Leslie", "", "Bartlett", true, "1951", "", 2, 3);
AppendPerson(7, "Cecilia", "", "Feeney", false, "1924", "1994", 4, 2);
AppendPerson(8, "Karen", "Gwenllian", "Duglan", false, "1960", "", 5, 3);
AppendPerson(7, "Gwynfryn", "", "Duglan", true, "1927", "2001", 6, 5);
AppendPerson(7, "Katie", "Mona", "Owen", false, "1929", "", 7, 5);
AppendPerson(6, "Charles", "Morris", "Bartlett", true, "1876", "1940", 8, 1);
AppendPerson(5, "William", "", "Duglan", true, "1873", "1930", 9, 10);
AppendPerson(8, "Kenneth", "", "Duglan", true, "1947", "", 5, 12);
AppendPerson(9, "Kathryn", "Jane", "Bartlett", false, "1985", "", 3, -1);
AppendPerson(8, "Gloria", "", "Tooley", false, "1947", "", -1, 11);
AppendPerson(8, "Maggie", "", "Russell", false, "", "", -1, 12);
AppendPerson(8, "Susan", "", "Duglan", false, "1950", "", 5, 13);
AppendPerson(8, "Rod", "", "Axon", true, "1949", "", -1, 13);
AppendPerson(8, "Daniel", "", "Duglan", true, "1953", "1992", 5, 14);
AppendPerson(8, "Lorraine", "", "Archer", false, "1957", "", -1, 14);
AppendPerson(8, "Darran", "", "Duglan", true, "1965", "", 5, 15);
AppendPerson(8, "Susan", "", "Cole", false, "1964", "", -1, 15);
AppendPerson(9, "Nicola", "", "Duglan", false, "", "", 15, -1);
AppendPerson(9, "Sarah", "", "Duglan", false, "", "", 11, -1);
AppendPerson(9, "Si'an", "", "Duglan", false, "", "", 11, -1);
AppendPerson(9, "Julie", "", "Axon", false, "1969", "", 13, 16);
AppendPerson(9, "Wayne", "", "Farmer", true, "", "", -1, 16);
AppendPerson(9, "Jane", "", "Axon", false, "1972", "", 13, 17);
AppendPerson(9, "Bryan", "", "McHugh", true, "", "", -1, 17);
AppendPerson(9, "Clare", "", "Axon", false, "1979", "", 13, 18);
AppendPerson(9, "Noah", "", "Saunders", true, "", "", -1, 18);
AppendPerson(9, "Amy", "", "Duglan", false, "", "", 14, -1);
AppendPerson(9, "Lewis", "", "Duglan", true, "", "", 14, -1);
AppendPerson(8, "Leonard", "", "Bartlett", true, "1953", "", 2, 19);
AppendPerson(8, "Barbara", "", "-----", false, "1953", "", -1, 19);
AppendPerson(8, "Patricia", "", "Bartlett", false, "1956", "", 2, 20);
AppendPerson(9, "Sarah", "", "Bartlett", false, "", "", -1, 21);
AppendPerson(9, "Simon", "", "Bartlett", true, "1976", "", 20, 21);
AppendPerson(6, "Thomas", "Leonard", "Feeney", true, "1895", "", 22, 4);
AppendPerson(10, "Adrienne", "", "Bartlett", false, "", "", 21, -1);
AppendPerson(10, "Mollie", "", "Bartlett", false, "", "", 21, -1);
AppendPerson(10, "Jemma", "", "Farmer", false, "", "", 16, -1);
AppendPerson(9, "Leah", "", "Bartlett", false, "", "", 19, -1);
AppendPerson(9, "Jamie", "", "Bartlett", true, "", "", 19, -1);
AppendPerson(9, "Ashley", "", "Bartlett", false, "", "", 19, -1);
AppendPerson(10, "Amy", "Rose", "Farmer", false, "", "", 16, -1);
AppendPerson(10, "Bethan", "", "Farmer", false, "", "", 16, -1);
AppendPerson(10, "Ben", "", "McHugh", true, "", "", 17, -1);
AppendPerson(10, "Owen", "", "McHugh", true, "", "", 17, -1);
AppendPerson(10, "Lewis", "", "McHugh", true, "", "", 17, -1);
AppendPerson(6, "Alice", "", "Emberson", false, "1898", "", 23, 4);
AppendPerson(7, "Tom", "", "Hutton", true, "", "", -1, 24);
AppendPerson(7, "Leonard", "", "Feeney", true, "", "", 4, -1);
AppendPerson(7, "Doris", "", "Feeney", false, "", "", 4, 24);
AppendPerson(7, "Patricia", "", "Feeney", false, "", "", 4, -1);
AppendPerson(7, "Mary", "", "Feeney", false, "", "", 4, 25);
AppendPerson(7, "Cecil", "Charles", "Bartlett", true, "1903", "", 1, -1);
AppendPerson(7, "David", "", "Lerch", true, "", "", -1, 25);
AppendPerson(7, "Harold", "", "Bartlett", true, "", "", 1, 26);
AppendPerson(7, "Renee", "", "Bartlett", false, "", "", 1, 27);
AppendPerson(8, "Robert", "", "Bartlett", true, "", "", 26, -1);
AppendPerson(8, "Lionel", "", "Bartlett", true, "", "", 26, -1);
AppendPerson(8, "Gerald", "", "Bartlett", true, "", "", 26, -1);
AppendPerson(8, "Maureen", "", "Bartlett", false, "", "", 26, -1);
AppendPerson(7, "Pat", "", "Bartlett", false, "", "", 1, 28);
AppendPerson(8, "Alan", "", "Webb", true, "", "", 28, -1);
AppendPerson(8, "Deanna", "", "Webb", false, "", "", 28, -1);
AppendPerson(8, "Jeanette", "", "Webb", false, "", "", 28, -1);
AppendPerson(8, "Sandra", "", "Webb", false, "", "", 28, -1);
AppendPerson(8, "Silvia", "", "Webb", false, "", "", 28, -1);
AppendPerson(8, "John", "", "Dyke", true, "", "", 27, -1);
AppendPerson(8, "Joey", "", "Dyke", true, "", "", 27, -1);
AppendPerson(8, "Dennis", "", "Dyke", true, "", "", 27, -1);
AppendPerson(8, "Dawn", "", "Hutton", false, "", "", 24, -1);
AppendPerson(8, "Linda", "", "Hutton", false, "", "", 24, -1);
AppendPerson(8, "Patricia", "", "Hutton", false, "", "", 24, -1);
AppendPerson(6, "Daniel", "Lewis", "Duglan", true, "1895", "1951", 10, 6);
AppendPerson(8, "Elizabeth", "", "Lerch", false, "", "", 25, -1);
AppendPerson(4, "Margaret", "", "-----", false, "1812", "", -1, 29);
AppendPerson(6, "Morris", "", "Owen", true, "1896", "1976", 30, 7);
AppendPerson(6, "Gwenllian", "", "Jones", false, "1900", "1955", 31, 7);
AppendPerson(9, "David", "Alun", "Bartlett", true, "1981", "", 3, -1);
AppendPerson(7, "Tegwen", "", "Duglan", false, "1925", "", 6, 32);
AppendPerson(7, "Norman", "", "Lake", true, "", "", -1, 32);
AppendPerson(4, "William", "", "Duglan", true, "1842", "1890", 33, 9);
AppendPerson(4, "Mary", "", "Thomas", false, "1848", "1920", 34, 9);
AppendPerson(7, "Olive", "", "-----", false, "", "", -1, 26);
AppendPerson(5, "Sarah", "", "Davies", false, "1873", "1930", 35, 10);
AppendPerson(5, "William", "", "Davies", true, "", "", -1, 36);
AppendPerson(6, "Gwyneth", "", "Duglan", false, "1901", "1960", 10, 37);
AppendPerson(6, "Harry", "James", "Garrett", true, "1895", "1964", 38, 37);
AppendPerson(6, "William", "George", "Duglan", true, "1893", "1952", 10, 39);
AppendPerson(6, "Lizzie", "M", "Walters", false, "", "", -1, 39);
AppendPerson(6, "Idris", "", "Duglan", true, "1894", "1953", 10, 40);
AppendPerson(6, "Elizabeth", "Ann", "Morris", false, "", "", 41, 40);
AppendPerson(6, "Henry", "", "Duglan", true, "1896", "", 10, -1);
AppendPerson(6, "Thomas", "(Naunton?)", "Duglan", true, "1910", "1978", 10, 42);
AppendPerson(6, "Doris", "", "Duglan", false, "1905", "1991", 10, 43);
AppendPerson(6, "Stanley", "John", "Wilson", true, "1905", "1995", -1, 43);
AppendPerson(6, "Ingram", "", "Duglan", true, "1892", "1932", 10, 44);
AppendPerson(5, "Charles", "", "Bartlett", true, "1851", "", 45, 8);
AppendPerson(6, "Elizabeth", "Mary", "Duglan", false, "1908", "1998", 10, 46);
AppendPerson(6, "Thomas", "Foster", "Bodley", true, "1902", "", -1, 46);
AppendPerson(6, "Eunice", "", "Duglan", false, "1902", "1993", 10, 47);
AppendPerson(6, "George", "", "Ford", true, "", "1955", -1, 47);
AppendPerson(6, "Olwen", "", "Duglan", false, "1903", "1987", 10, 48);
AppendPerson(6, "George", "", "Hardwick", true, "1889", "1975", -1, 48);
AppendPerson(6, "Morfydd", "", "Duglan", false, "1914", "1991", 10, 49);
AppendPerson(6, "Raymond", "Lyndhurst", "Samuels", true, "1915", "1997", -1, 49);
AppendPerson(6, "Ewert", "", "Duglan", true, "1898", "1979", 10, 52);
AppendPerson(6, "Doris", "", "Greenslade", false, "1902", "1938", -1, 50);
AppendPerson(6, "Winston", "", "Duglan", true, "1907", "1924", 10, -1);
AppendPerson(6, "Sarah", "", "Duglan", false, "1911", "1920", 10, -1);
AppendPerson(6, "Eira", "", "Duglan", false, "1917", "1926", 10, -1);
AppendPerson(5, "Thomas", "", "Duglan", true, "1868", "", 9, -1);
AppendPerson(5, "John", "(Jack)", "Duglan", true, "1870", "", 9, 53);
AppendPerson(5, "Henry", "(Harry)", "Duglan", true, "1877", "", 9, -1);
AppendPerson(5, "Mary", "(Elizabeth or Jane?)", "Duglan", false, "1879", "", 9, 54);
AppendPerson(6, "Lilian", "Winifred", "Williams", false, "1881", "", 55, 1);
AppendPerson(5, "Gwendoline", "", "Duglan", false, "1881", "", 9, 56);
AppendPerson(5, "Daniel", "", "Duglan", true, "1889", "", 9, 57);
AppendPerson(3, "Sarah", "", "Bartlett", false, "1789", "1866", 58, 59);
AppendPerson(7, "Joan", "", "Wilson", false, "1925", "", 43, 60);
AppendPerson(7, "John", "Duglan", "Bodley", true, "1930", "", 46, 61);
AppendPerson(7, "Moira", "Duglan", "Garrett", false, "1926", "1996", 37, 62);
AppendPerson(7, "Unis", "Duglan", "Garrett", false, "1928", "", 37, 63);
AppendPerson(5, "Eliza", "", "Morris", false, "", "", -1, 38);
AppendPerson(7, "Harold", "Edward", "Roberts", true, "1913", "1994", -1, 62);
AppendPerson(6, "Catherine", "(Kate) Ann", "Davies", false, "1903", "1977", 36, 6);
AppendPerson(6, "Anne", "(Annie)", "Williams", false, "1897", "1983", -1, 44);
AppendPerson(7, "David", "", "Wilson", true, "1931", "", 43, 64);
AppendPerson(7, "Eira", "", "Wilson", false, "1938", "", 43, 65);
AppendPerson(7, "Vernon", "", "Duglan", true, "1929", "", 50, 66);
AppendPerson(6, "Caroline", "E", "Bartlett", false, "", "", 8, -1);
AppendPerson(5, "Elizabeth", "", "?", false, "1849", "", -1, 55);
AppendPerson(5, "Sarah", "Ann (Nan)", "Duglan", false, "1884", "", 9, 67);
AppendPerson(5, "Catherine", "", "Williams", false, "1864", "1922", 68, 30);
AppendPerson(5, "John", "", "Owen", true, "1838", "1917", 29, 30);
AppendPerson(4, "Owen", "", "Jones", true, "1808", "", -1, 29);
AppendPerson(4, "Margaret", "", "Williams", false, "1844", "", -1, 68);
AppendPerson(7, "?", "", "Dyke", true, "", "", -1, 27);
AppendPerson(5, "Lewis", "", "Jones", true, "1859", "1913", -1, 31);
AppendPerson(5, "Elizabeth", "", "Jones", false, "1861", "1926", -1, 31);
AppendPerson(4, "John", "", "Williams", true, "1841", "", -1, 68);
AppendPerson(5, "Esther", "Emma", "Morgan", false, "", "", -1, 36);
AppendPerson(7, "?", "", "Webb", true, "", "", -1, 28);
AppendPerson(6, "Ada", "Blanche", "Williams", false, "", "", 55, -1);
AppendPerson(5, "John", "Abel", "Williams", true, "", "", -1, 55);
AppendPerson(5, "Emily", "Ann", "Morris", false, "1842", "", 69, 8);
AppendPerson(4, "George", "", "Bartlett", true, "1822", "", -1, 45);
AppendPerson(4, "Elizabeth", "", "Thomas", false, "", "", -1, 35);
AppendPerson(5, "Eliza", "", "Bartlett", false, "", "", 45, -1);
AppendPerson(5, "Mariann", "", "Bartlett", false, "", "", 45, -1);
AppendPerson(5, "?", "Thomas", "(?)", true, "", "", -1, 56);
AppendPerson(9, "Angela", "", "?", false, "", "", 70, -1);
AppendPerson(8, "Lyn", "", "-----", false, "", "", -1, 71);
AppendPerson(1, "Edward", "", "Bartlett", true, "1737", "", 72, 73);
AppendPerson(0, "Richard", "", "Bartlett", true, "1703", "1760", -1, 72);
AppendPerson(8, "Janice", "", "-----", false, "", "", -1, 74);
AppendPerson(0, "Ann", "", "Rushall", false, "", "", -1, 72);
AppendPerson(3, "Joseph", "", "Kirby", true, "1793", "1875", -1, 59);
AppendPerson(9, "Rachel", "", "Jones", false, "", "", 74, -1);
AppendPerson(1, "Ann", "", "Frankland", false, "", "", -1, 73);
AppendPerson(2, "William", "", "Bartlett", true, "1763", "", 73, 58);
AppendPerson(2, "Mary", "", "?", false, "", "", -1, 58);
AppendPerson(3, "James", "", "Bartlett", true, "", "", 58, -1);
AppendPerson(3, "Susannah", "", "Bartlett", false, "1787", "", 58, 75);
AppendPerson(3, "John", "", "Bartlett", true, "", "", -1, 75);
AppendPerson(4, "Eliza", "", "Bartlett", false, "", "", 75, -1);
AppendPerson(4, "Ann", "", "Bartlett", false, "", "", 75, -1);
AppendPerson(7, "Valerie", "", "Duglan", false, "1931", "", 50, 76);
AppendPerson(4, "Sarah", "", "Bartlett", false, "1810", "", 75, 45);
AppendPerson(7, "Penelope", "Anne", "Hardwick", false, "1937", "", 48, 77);
AppendPerson(5, "Elizabeth", "Ann", "Davies", false, "1875", "1958", 78, 53);
AppendPerson(6, "William", "Henry", "Duglan", true, "1892", "", 53, -1);
AppendPerson(4, "Thomas", "", "Morris", true, "", "", -1, 69);
AppendPerson(5, "George", "", "Duglan", true, "1886", "", 9, -1);
AppendPerson(3, "William", "", "Duglan", true, "", "", -1, 33);
AppendPerson(3, "Thomas", "", "Thomas", true, "", "", -1, 34);
AppendPerson(5, "Thomas", "", "Harding", true, "", "", -1, 67);
AppendPerson(5, "John", "Summerhill", "James", true, "", "", -1, 54);
AppendPerson(6, "Danny", "", "James", true, "", "", 54, -1);
AppendPerson(6, "Annie-Mary", "", "James", false, "", "", 54, -1);
AppendPerson(6, "Harry", "", "?", true, "", "", -1, 79);
AppendPerson(6, "Clarice", "", "James", false, "", "", 54, 79);
AppendPerson(6, "Nesta", "", "James", false, "", "", 54, 80);
AppendPerson(6, "Norman", "", "James", true, "", "", 54, -1);
AppendPerson(6, "Ivor", "", "James", true, "", "", 54, -1);
AppendPerson(5, "Mary", "Ann", "Keefe", false, "1889", "1975", -1, 57);
AppendPerson(6, "Roy", "", "Duglan", true, "1920", "", 57, -1);
AppendPerson(7, "Edna", "", "Duglan", false, "1919", "1984", 44, 81);
AppendPerson(7, "Gwynfryn", "", "Jones", true, "", "", -1, 63);
AppendPerson(8, "Eric", "", "Jones", true, "", "", 63, -1);
AppendPerson(8, "Kevin", "", "Jones", true, "1961", "", 63, 74);
AppendPerson(5, "James", "", "Duglan", true, "1872", "", 9, -1);
AppendPerson(5, "Mary", "", "Duglan", false, "1875", "", 9, -1);
AppendPerson(6, "Mary", "", "?", false, "", "", -1, 42);
AppendPerson(7, "Elfed", "", "Richards", true, "", "", -1, 81);
AppendPerson(7, "Phyllis", "", "Duglan", false, "1917", "1998", 39, 82);
AppendPerson(7, "Ted", "", "Jones", true, "1912", "1995", -1, 82);
AppendPerson(7, "Megan", "", "Duglan", false, "1924", "1995", 39, 83);
AppendPerson(7, "John", "", "Rees", true, "", "", -1, 83);
AppendPerson(7, "Stanley", "", "Duglan", true, "1914", "1977", 40, 84);
AppendPerson(7, "Cledwyn", "", "Duglan", true, "", "", 40, 85);
AppendPerson(9, "Amy", "", "Jones", false, "", "", 74, -1);
AppendPerson(7, "Maldwyn", "", "Duglan", true, "", "1987", 40, 86);
AppendPerson(7, "Glenys", "", "Duglan", false, "", "", 40, 87);
AppendPerson(7, "Brenda", "", "Duglan", false, "", "", 40, 88);
AppendPerson(6, "Lydia", "", "Lawrence", false, "", "", -1, 51);
AppendPerson(7, "Elfed", "", "Garrett", true, "", "", 37, -1);
AppendPerson(7, "Maureen", "", "Samuels", false, "1937", "", 49, 89);
AppendPerson(7, "Anne", "", "Samuels", false, "1937", "", 49, -1);
AppendPerson(6, "David", "Thomas", "(?)", true, "", "", 56, -1);
AppendPerson(6, "Richard", "", "Jones", true, "", "1907", 31, -1);
AppendPerson(7, "Megan", "", "Owen", false, "", "", 7, -1);
AppendPerson(7, "Phyllis", "", "Owen", false, "", "", 7, -1);
AppendPerson(7, "Gwendoline", "", "Owen", false, "1942", "1942", 7, -1);
AppendPerson(7, "Nan", "", "Owen", false, "", "", 7, -1);
AppendPerson(7, "Elfed", "", "Owen", true, "", "", 7, -1);
AppendPerson(7, "Mwynwen", "", "Owen", false, "", "", 7, -1);
AppendPerson(7, "Goronwy", "", "Owen", true, "", "", 7, -1);
AppendPerson(7, "Mair", "", "Owen", false, "", "", 7, -1);
AppendPerson(6, "William", "", "Jones", true, "", "", 31, -1);
AppendPerson(7, "Margaret", "", "Owen", false, "", "", 7, -1);
AppendPerson(7, "Edna", "", "Hynes", false, "", "", -1, 84);
AppendPerson(8, "Raymond", "", "Duglan", true, "", "", 84, -1);
AppendPerson(8, "Muriel", "", "Duglan", false, "", "", 84, -1);
AppendPerson(8, "Carole", "", "Duglan", false, "", "", 84, -1);
AppendPerson(8, "Maureen", "", "Duglan", false, "", "", 84, -1);
AppendPerson(8, "Stan", "", "Duglan", true, "", "", 84, 90);
AppendPerson(8, "Gloria", "", "Duglan", false, "", "", 84, -1);
AppendPerson(9, "Sean", "", "Duglan", true, "", "", 90, 91);
AppendPerson(8, "Edward", "", "Duglan", true, "", "", 92, 93);
AppendPerson(7, "Joyce", "", "?", false, "", "", -1, 85);
AppendPerson(8, "Beryl", "", "Duglan", false, "", "", 85, 94);
AppendPerson(8, "Elizabeth", "", "Duglan", false, "", "", 85, -1);
AppendPerson(8, "Pamela", "", "Duglan", false, "", "", 85, -1);
AppendPerson(7, "Margaret", "(Maggie)", "?", false, "", "", -1, 86);
AppendPerson(8, "David", "", "Duglan", true, "1949", "1996", 86, 95);
AppendPerson(8, "Jeanette", "", "Duglan", false, "", "", 86, 96);
AppendPerson(7, "Sam", "", "Bernard", true, "", "", -1, 88);
AppendPerson(8, "Linda", "", "?", false, "", "", 88, -1);
AppendPerson(8, "Michael", "", "?", true, "", "", 88, -1);
AppendPerson(7, "Herbert", "'Jock'", "Jarvis", true, "1938", "", -1, 87);
AppendPerson(8, "Duglan", "", "Jarvis", true, "", "", 87, 70);
AppendPerson(5, "Owen", "", "Jones", true, "", "", 29, -1);
AppendPerson(6, "Kenneth", "", "Duglan", true, "", "", 53, -1);
AppendPerson(7, "Jenet", "", "?", false, "", "", 79, -1);
AppendPerson(7, "Barry", "", "Chatterton", true, "", "", -1, 65);
AppendPerson(6, "Chris", "", "John", true, "", "", -1, 80);
AppendPerson(7, "Ann", "", "John", false, "", "", 80, -1);
AppendPerson(6, "Owen", "(Jones ?)", "Owen", true, "", "", 30, -1);
AppendPerson(6, "John", "", "Owen", true, "1889", "", 30, -1);
AppendPerson(6, "Edward", "", "Owen", true, "1892", "", 30, -1);
AppendPerson(6, "William", "", "Owen", true, "1893", "", 30, -1);
AppendPerson(6, "May", "", "Jones", false, "", "", 31, -1);
AppendPerson(6, "Elizabeth", "", "Jones", false, "", "", 31, -1);
AppendPerson(6, "Anne", "May", "Jones", false, "", "", 31, -1);
AppendPerson(6, "David", "", "Jones", true, "", "", 31, -1);
AppendPerson(6, "Lewis", "", "Jones", true, "", "", 31, -1);
AppendPerson(6, "Mary", "", "Owen", false, "", "", 30, -1);
AppendPerson(6, "Joe", "", "Owen", true, "", "", 30, -1);
AppendPerson(6, "Maggie", "", "Owen", false, "", "", 30, -1);
AppendPerson(6, "Jane", "", "Owen", false, "", "", 30, -1);
AppendPerson(6, "Ben", "", "Owen", true, "1909", "", 30, -1);
AppendPerson(6, "Katie", "", "Owen", false, "", "", 30, -1);
AppendPerson(5, "Elizabeth", "", "Williams", false, "", "", 68, -1);
AppendPerson(7, "Gwyn", "", "Duglan", true, "1903", "", 40, 92);
AppendPerson(7, "Meirion", "", "Davies", true, "", "", -1, 60);
AppendPerson(7, "Nancy", "", "Pryse", false, "", "", -1, 64);
AppendPerson(4, "William", "", "Davies", true, "", "", -1, 35);
AppendPerson(8, "Terry", "", "Jones", true, "", "", 82, 71);
AppendPerson(8, "Michael", "", "Rees", true, "", "", 83, -1);
AppendPerson(4, "Henry", "", "Davies", true, "", "", -1, 78);
AppendPerson(7, "Pearl", "", "Dean", false, "", "", -1, 66);
AppendPerson(8, "Sherry", "", "Duglan", false, "", "", 66, -1);
AppendPerson(7, "Bruce", "", "Ball", true, "", "2001", -1, 76);
AppendPerson(8, "Bronwen", "Caroline", "Ball", false, "1967", "", 76, 97);
AppendPerson(8, "Jonathan", "", "Ball", true, "1969", "", 76, 98);
AppendPerson(8, "James", "Duglan", "Ball", true, "1969", "", 76, 99);
AppendPerson(6, "Annie", "", "Lawrence", false, "", "", -1, 52);
AppendPerson(8, "Anthony", "Graham", "Roberts", true, "1949", "", 62, 100);
AppendPerson(8, "Sally", "Ann", "Roberts", false, "", "", 62, -1);
AppendPerson(8, "Celfyn", "", "Jones", true, "1959", "", 63, -1);
AppendPerson(7, "Basil", "", "Mahon", true, "", "", -1, 77);
AppendPerson(8, "Timothy", "", "Mahon", true, "", "", 77, -1);
AppendPerson(8, "Sara", "", "Mahon", false, "", "", 77, -1);
AppendPerson(8, "Danny", "", "Mahon", true, "1965", "", 77, 101);
AppendPerson(8, "Gareth", "", "Davies", true, "", "", 60, -1);
AppendPerson(8, "Menna", "", "Wilson", false, "", "", 64, -1);
AppendPerson(8, "Martin", "", "Wilson", true, "", "", 64, -1);
AppendPerson(5, "?", "", "Davies", false, "", "", 78, -1);
AppendPerson(7, "Jaqueline", "(Jackie)", "Oakshot", false, "", "", -1, 61);
AppendPerson(8, "Mathew", "", "Bodley", true, "", "", 61, -1);
AppendPerson(8, "Catherine", "", "Bodley", false, "", "", 61, -1);
AppendPerson(8, "Daisy", "", "Bodley", false, "", "", 61, -1);
AppendPerson(7, "Raymond", "Rhys", "Davies", true, "1928", "", -1, 89);
AppendPerson(8, "Evan", "Griffith", "Davies", true, "", "", 89, -1);
AppendPerson(8, "David", "Rhys", "Davies", true, "", "", 89, -1);
AppendPerson(5, "James", "", "Feeney", true, "", "", -1, 22);
AppendPerson(5, "John", "", "Emberson", true, "", "", -1, 23);
AppendPerson(7, "Hilda", "", "?", false, "", "", -1, 92);
AppendPerson(5, "Richard", "", "Morris", true, "", "", -1, 41);
AppendPerson(8, "Ann", "", "Duglan", false, "", "", 92, -1);
AppendPerson(8, "Rosie", "", "Duglan", false, "", "", 92, -1);
AppendPerson(7, "William", "Ewart", "Duglan", true, "1915", "", 39, -1);
AppendPerson(9, "Clifford", "", "Duglan", true, "", "", 93, 102);
AppendPerson(9, "Karen", "M.M.", "Duglan", false, "", "", 95, 102);
AppendPerson(8, "Rita", "", "-----", false, "", "", -1, 90);
AppendPerson(10, "Charlotte", "", "Duglan", false, "", "", 102, -1);
AppendPerson(10, "Jessica", "", "Duglan", false, "", "", 102, -1);
AppendPerson(9, "David", "", "-----", true, "", "", 94, 103);
AppendPerson(9, "Stephen", "", "-----", true, "", "", 94, 104);
AppendPerson(10, "Liana", "Rose", "-----", false, "", "", 103, -1);
AppendPerson(10, "Christen", "", "-----", false, "", "", 103, -1);
AppendPerson(10, "Christopher", "", "-----", true, "", "", 104, -1);
AppendPerson(9, "Elizabeth", "", "-----", false, "", "", 94, 105);
AppendPerson(10, "Phillip", "", "-----", true, "", "", 105, 106);
AppendPerson(11, "Samuel", "", "-----", true, "", "", 106, -1);
AppendPerson(9, "Victoria", "", "Duglan", false, "", "", 95, 107);
AppendPerson(9, "Carla", "", "Duglan", false, "", "", 95, 108);
AppendPerson(10, "Emily", "", "-----", false, "", "", 107, -1);
AppendPerson(10, "Joseph", "", "-----", true, "", "", 108, -1);
AppendPerson(10, "Cai", "", "-----", true, "", "", 108, -1);
AppendPerson(9, "Paul", "", "-----", true, "", "", 96, 109);
AppendPerson(9, "Sarah", "", "-----", false, "", "", 96, 110);
AppendPerson(10, "Sam", "", "-----", true, "", "", 109, -1);
AppendPerson(10, "Amelia", "", "-----", false, "", "", 110, -1);
AppendPerson(9, "Emma", "", "Duglan", false, "", "", 93, 111);
AppendPerson(9, "Rachel", "", "Duglan", false, "", "", 93, 112);
AppendPerson(10, "Oliver", "", "-----", true, "", "", 111, -1);
AppendPerson(10, "Rebecca", "", "-----", false, "", "", 112, -1);
AppendPerson(8, "Diane", "", "Duglan", false, "", "", 92, 113);
AppendPerson(9, "Steven", "", "-----", true, "", "", 113, -1);
AppendPerson(9, "Kelly", "", "-----", false, "", "", 113, -1);
AppendPerson(9, "Martin", "", "-----", true, "", "", 113, -1);
AppendPerson(8, "Glenys", "", "Jarvis", false, "", "", 87, -1);
AppendPerson(9, "Caitlin", "Erin", "Masoliver", false, "", "", 97, -1);
AppendPerson(8, "?", "", "Masoliver", true, "", "", -1, 97);
AppendPerson(9, "Maya", "Lilian", "Masoliver", false, "", "", 97, -1);
AppendPerson(9, "Luca", "Michael Bruce", "Masoliver", true, "", "", 97, -1);
AppendPerson(8, "Elizabeth", "", "-----", false, "", "", -1, 100);
AppendPerson(9, "Richard", "Edward", "Roberts", true, "", "", 100, -1);
AppendPerson(9, "Lisa", "Marie", "Roberts", false, "", "", 100, -1);
AppendPerson(9, "Ryland", "", "Phillips", true, "", "", -1, 108);
AppendPerson(9, "Jayne", "", "Duglan", false, "", "", 90, -1);
AppendPerson(9, "Madeline", "Poppy", "Ball", false, "", "", 98, -1);
AppendPerson(9, "Sophie", "Daisy", "Ball", false, "", "", 98, -1);
AppendPerson(9, "Amelia", "Rose", "Ball", false, "", "", 98, -1);
AppendPerson(7, "Pearl", "", "Duglan", false, "", "", 50, 114);
AppendPerson(8, "Cherry", "(or Cherieley)", "-----", false, "", "", 114, -1);
AppendPerson(8, "Verig", "", "-----", true, "", "", -1, 96);
AppendPerson(9, "Oliver", "Michael Duglan", "Ball", true, "", "", 99, -1);
AppendPerson(9, "Emily", "Ann", "Mahon", false, "", "", 101, -1);
AppendPerson(9, "Kim", "", "Duglan", false, "", "", 90, 115);
AppendPerson(9, "Nerys", "", "Evans", false, "", "", -1, 91);
AppendPerson(10, "William", "", "Evans", true, "", "", 91, -1);
AppendPerson(9, "Keith", "", "Jobson", true, "", "", -1, 115);
AppendPerson(10, "Jamie", "", "Jobson", true, "", "", 115, -1);
AppendPerson(10, "Carrie", "", "Jobson", false, "", "", 115, -1);
AppendPerson(7, "Unknown", "", "", true, "", "", -1, 114);
AppendPerson(8, "Unknown", "", "", true, "", "", -1, 113);
AppendPerson(9, "Unknown", "", "", true, "", "", -1, 112);
AppendPerson(9, "Unknown", "", "", true, "", "", -1, 111);
AppendPerson(9, "Unknown", "", "", true, "", "", -1, 110);
AppendPerson(9, "Unknown", "", "", false, "", "", -1, 109);
AppendPerson(9, "Unknown", "", "", true, "", "", -1, 107);
AppendPerson(10, "Unknown", "", "", false, "", "", -1, 106);
AppendPerson(9, "Unknown", "", "", true, "", "", -1, 105);
AppendPerson(9, "Unknown", "", "", false, "", "", -1, 104);
AppendPerson(9, "Unknown", "", "", false, "", "", -1, 103);
AppendPerson(8, "Unknown", "", "", false, "", "", -1, 101);
AppendPerson(8, "Unknown", "", "", false, "", "", -1, 99);
AppendPerson(8, "Unknown", "", "", false, "", "", -1, 98);
AppendPerson(8, "Unknown", "", "", false, "", "", -1, 95);
AppendPerson(8, "Unknown", "", "", true, "", "", -1, 94);
AppendPerson(8, "Unknown", "", "", false, "", "", -1, 93);
AppendPerson(4, "Unknown", "", "", false, "", "", -1, 78);
AppendPerson(8, "Unknown", "", "", false, "", "", -1, 70);
AppendPerson(4, "Unknown", "", "", false, "", "", -1, 69);
AppendPerson(5, "Unknown", "", "", false, "", "", -1, 41);
AppendPerson(5, "Unknown", "", "", true, "", "", -1, 38);
AppendPerson(3, "Unknown", "", "", false, "", "", -1, 34);
AppendPerson(3, "Unknown", "", "", false, "", "", -1, 33);
AppendPerson(5, "Unknown", "", "", false, "", "", -1, 23);
AppendPerson(5, "Unknown", "", "", false, "", "", -1, 22);
AppendPerson(8, "Unknown", "", "", true, "", "", -1, 20);

AppendFamily(-1, -1, [227]);
AppendFamily(6, 114, [0, 52, 54, 55, 60]);
AppendFamily(0, 2, [1, 29, 31]);
AppendFamily(1, 3, [9, 77]);
AppendFamily(34, 46, [2, 48, 49, 50, 51]);
AppendFamily(4, 5, [3, 8, 12, 14, 16]);
AppendFamily(72, 124, [4, 78]);
AppendFamily(75, 76, [5, 210, 211, 212, 213, 214, 215, 216, 217, 219]);
AppendFamily(96, 144, [6, 129]);
AppendFamily(80, 81, [7, 110, 111, 112, 113, 115, 116, 131, 172, 190, 191]);
AppendFamily(7, 83, [72, 85, 87, 89, 91, 92, 93, 95, 97, 99, 101, 103, 105, 107, 108, 109]);
AppendFamily(8, 10, [19, 20]);
AppendFamily(8, 11, []);
AppendFamily(13, 12, [21, 23, 25]);
AppendFamily(14, 15, [27, 28]);
AppendFamily(16, 17, [18]);
AppendFamily(22, 21, [37, 41, 42]);
AppendFamily(24, 23, [43, 44, 45]);
AppendFamily(26, 25, []);
AppendFamily(29, 30, [38, 39, 40]);
AppendFamily(382, 31, [33]);
AppendFamily(33, 32, [35, 36]);
AppendFamily(295, 381, [34]);
AppendFamily(296, 380, [46]);
AppendFamily(47, 49, [69, 70, 71]);
AppendFamily(53, 51, [73]);
AppendFamily(54, 82, [56, 57, 58, 59]);
AppendFamily(136, 55, [66, 67, 68]);
AppendFamily(141, 60, [61, 62, 63, 64, 65]);
AppendFamily(134, 74, [133, 241]);
AppendFamily(133, 132, [75, 247, 248, 249, 250, 256, 257, 258, 259, 260, 261]);
AppendFamily(137, 138, [76, 209, 218, 251, 252, 253, 254, 255]);
AppendFamily(79, 78, []);
AppendFamily(173, 379, [80]);
AppendFamily(174, 378, [81]);
AppendFamily(266, 146, [83]);
AppendFamily(84, 140, [124]);
AppendFamily(86, 85, [120, 121, 205]);
AppendFamily(377, 122, [86]);
AppendFamily(87, 88, [194, 196, 301]);
AppendFamily(89, 90, [198, 199, 201, 202, 203, 263]);
AppendFamily(298, 376, [90]);
AppendFamily(92, 192, []);
AppendFamily(94, 93, [118, 126, 127]);
AppendFamily(95, 125, [186]);
AppendFamily(145, 167, [96, 147, 148]);
AppendFamily(98, 97, [119]);
AppendFamily(100, 99, []);
AppendFamily(102, 101, [168]);
AppendFamily(104, 103, [206, 207]);
AppendFamily(105, 106, [128, 166, 345]);
AppendFamily(105, 204, []);
AppendFamily(105, 276, []);
AppendFamily(111, 169, [170, 242]);
AppendFamily(176, 113, [177, 178, 180, 181, 182, 183]);
AppendFamily(143, 130, [114, 142]);
AppendFamily(149, 115, [208]);
AppendFamily(116, 184, [185]);
AppendFamily(159, 160, [117, 161, 162]);
AppendFamily(156, 117, []);
AppendFamily(264, 118, [284]);
AppendFamily(119, 288, [289, 290, 291]);
AppendFamily(123, 120, [277, 278]);
AppendFamily(187, 121, [188, 189, 279]);
AppendFamily(126, 265, [285, 286]);
AppendFamily(244, 127, []);
AppendFamily(128, 270, [271]);
AppendFamily(175, 131, []);
AppendFamily(139, 135, [132, 262]);
AppendFamily(171, 375, [144]);
AppendFamily(240, 374, [150]);
AppendFamily(267, 151, []);
AppendFamily(153, 155, [152]);
AppendFamily(152, 158, [159]);
AppendFamily(189, 154, [157, 200]);
AppendFamily(163, 162, [164, 165, 167]);
AppendFamily(272, 166, [273, 274, 275]);
AppendFamily(280, 168, [281, 282, 283]);
AppendFamily(269, 373, [169, 287]);
AppendFamily(179, 180, [243]);
AppendFamily(245, 181, [246]);
AppendFamily(193, 186, []);
AppendFamily(195, 194, [267]);
AppendFamily(197, 196, [268]);
AppendFamily(198, 220, [221, 222, 223, 224, 225, 226]);
AppendFamily(199, 229, [230, 231, 232]);
AppendFamily(201, 233, [234, 235]);
AppendFamily(239, 202, [240, 332]);
AppendFamily(236, 203, [237, 238]);
AppendFamily(292, 206, [293, 294]);
AppendFamily(225, 304, [227, 341, 350]);
AppendFamily(227, 351, [352]);
AppendFamily(263, 297, [228, 299, 300, 328]);
AppendFamily(228, 372, [302, 324, 325]);
AppendFamily(371, 230, [307, 308, 312]);
AppendFamily(234, 370, [303, 315, 316]);
AppendFamily(347, 235, [320, 321]);
AppendFamily(334, 273, [333, 335, 336]);
AppendFamily(274, 369, [342, 343, 344]);
AppendFamily(275, 368, [348]);
AppendFamily(277, 337, [338, 339]);
AppendFamily(283, 367, [349]);
AppendFamily(302, 303, [305, 306]);
AppendFamily(307, 366, [309, 310]);
AppendFamily(308, 365, [311]);
AppendFamily(364, 312, [313]);
AppendFamily(313, 363, [314]);
AppendFamily(362, 315, [317]);
AppendFamily(340, 316, [318, 319]);
AppendFamily(320, 361, [322]);
AppendFamily(360, 321, [323]);
AppendFamily(359, 324, [326]);
AppendFamily(358, 325, [327]);
AppendFamily(357, 328, [329, 330, 331]);
AppendFamily(356, 345, [346]);
AppendFamily(353, 350, [354, 355]);


StatusBox.Show('Family tree initialisation');
PersonProcess(0);
  
};
