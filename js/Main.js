var formVP = $('#vpcoords');
var formAW = $('#awcoords');
var vpX    = $('#vpX');
var vpY    = $('#vpY');
var vpZ    = $('#vpZ');
var vpSF   = $('#vpSF');
var awLon  = $('#awLon');
var awLat  = $('#awLat');
var awAlt  = $('#awAlt');
var awNS   = $('#awNS');
var awWE   = $('#awWE');

var terrTileX = $('#terrTileX');
var terrTileZ = $('#terrTileZ');
var terrNodeX = $('#terrNodeX');
var terrNodeZ = $('#terrNodeZ');
var terrTileCellX = $('#terrTileCellX');
var terrTileCellZ = $('#terrTileCellZ');
var terrNodeCellX = $('#terrNodeCellX');
var terrNodeCellZ = $('#terrNodeCellZ');

var CalcValues = function(x)
{
    // Snap coordinate to global cell
    var cell     = Math.floor(x / vpSF.val());
    var negative = cell < 0;

    // Calculate tile number
    this.Tile = negative
        ? Math.ceil( (cell + 1) / 32 - 1 )
        : Math.floor(cell / 32);

    // Calculate cell offset relative to tile origin
    this.TileCell = cell % 32;

    if (this.TileCell < 0)
        this.TileCell = this.TileCell + 32;

    // Calculate node offset relative to node origin
    this.NodeCell = this.TileCell % 8;

    // Calculate node relative to tile origin
    this.Node = Math.floor(this.TileCell / 8);
};

function handleVP()
{
    var x = vpX.val();
    var y = vpY.val();
    var z = vpZ.val();
    var calcX = new CalcValues(x);
    var calcZ = new CalcValues(z);

    terrTileX.val(calcX.Tile);
    terrTileCellX.val(calcX.TileCell);
    terrNodeCellX.val(calcX.NodeCell);
    terrNodeX.val(calcX.Node);

    terrTileZ.val(calcZ.Tile);
    terrTileCellZ.val(calcZ.TileCell);
    terrNodeCellZ.val(calcZ.NodeCell);
    terrNodeZ.val(calcZ.Node);

    var ns = (z >= 0) ? 'N' : 'S';
    var we = (x >= 0) ? 'W' : 'E';

    x = Math.abs(x);
    z = Math.abs(z);

    awLon.val(x);
    awLat.val(z);
    awNS.val(ns);
    awWE.val(we);
    awAlt.val(y);

    return false; // prevent submit
}

function handleAW()
{
    var lat = awLat.val();
    var lon = awLon.val();
    var alt = awAlt.val();

    if (awNS.val() == 'S')
        lat = 0 - lat;

    if (awWE.val() == 'E')
        lon = 0 - lon;

    vpX.val(lon);
    vpZ.val(lat);
    vpY.val(alt);

    return false; // prevent submit
}

formVP.submit(handleVP);
formAW.submit(handleAW);