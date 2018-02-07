//@flow

class BaseProvider {
    key: string;
    init: () => Promise<$Subtype<BaseProvider>>;
}

export default BaseProvider;