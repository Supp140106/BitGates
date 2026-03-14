export const getInputValue = (conn, nodeData) => {
    if (!conn || !conn[0] || !nodeData) return 0;
    const handle = conn[0].sourceHandle;
    if (handle === 'notq') return nodeData.data.notQ ?? 0;
    if (handle === 'q') return nodeData.data.q ?? nodeData.data.value ?? 0;
    return nodeData.data.value ?? 0;
};
