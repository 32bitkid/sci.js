const enum Operation {
    Done = -1,
    SetLayer,
    DisableLayer,

    Lines,
    Fills,
    SetPattern,
    Patterns,

    UpdatePalette,

    SetPalette,
}

export default Operation;
