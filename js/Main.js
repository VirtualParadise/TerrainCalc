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

    // First, determine tile
    var tileCellLowerBound, tileCellUpperBound;
    var tile = 0;
    var tileStep = negative ? -1 : 1;

    while (true)
    {
        tileCellLowerBound = tile * 32;
        tileCellUpperBound = tileCellLowerBound + 32;

        if (cell >= tileCellLowerBound && cell < tileCellUpperBound)
            break;

        tile += tileStep;
    }

    // Next, determine offset within that tile (or: the tile cell)
    // And also the node it is in
    var node = 0;
    var cellRelativeToNode = 0;
    var cellRelativeToTile = 0;
    var cellRelativeToTileSearch = tileCellLowerBound;

    while (true)
    {
        if (cellRelativeToNode >= 8)
        {
            node++;
            cellRelativeToNode = 0;
        }

        if (cellRelativeToTileSearch == cell)
            break;

        cellRelativeToTileSearch++;
        cellRelativeToTile++;
        cellRelativeToNode++;
    }

    this.Tile = tile;
    this.TileCell = cellRelativeToTile;
    this.NodeCell = cellRelativeToNode;
    this.Node = node;
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