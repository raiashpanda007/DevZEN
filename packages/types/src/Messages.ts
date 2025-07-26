const MESSAGE_INIT = "project_initialized"
const DIR_FETCH = "dir_fetch"
const FILE_FETCH = "file_fetch"
const RECEIVED_DIR_FETCH = "received_dir_fetch"
const RECEIVED_INIT_DIR_FETCH = "received_init_dir_fetch"
const RECIEVED_FILE_FETCH = "received_file_fetch"
const MESSAGE_CREATE_FILE = 'create_file'
const MESSAGE_DELETE_FILE = 'delete_file'
const MESSAGE_CREATE_FOLDER = 'create_folder'
const MESSAGE_DELETE_FOLDER = 'delete_folder'
const MESSAGE_RENAME_FOLDER = 'rename_folder'
const MESSAGE_RENAME_FILE = 'rename_file'
const MESSAGE_SAVE_FILE_CONTENT = 'file_update'
const MESSAGE_CRDT_UPDATE = "crdt_update_server_side"
const MESSAGE_REQUEST_TERMINAL = "message_terminal:start"
const MESSAGE_UPDATE_TERMINAL = "message_terminal:update"
export const Messages = {
    MESSAGE_INIT,
    DIR_FETCH,
    FILE_FETCH,
    RECEIVED_DIR_FETCH,
    RECEIVED_INIT_DIR_FETCH,
    RECIEVED_FILE_FETCH,
    MESSAGE_CREATE_FILE,
    MESSAGE_DELETE_FILE,
    MESSAGE_CREATE_FOLDER,
    MESSAGE_DELETE_FOLDER,
    MESSAGE_RENAME_FOLDER,
    MESSAGE_RENAME_FILE,
    MESSAGE_SAVE_FILE_CONTENT,
    MESSAGE_CRDT_UPDATE,
    MESSAGE_REQUEST_TERMINAL,
    MESSAGE_UPDATE_TERMINAL
} as const;