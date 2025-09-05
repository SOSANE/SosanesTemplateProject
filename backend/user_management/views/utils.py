# function that verifies if the specified parameter is undefined
def is_undefined(value):
    if value is None:
        return True
    if value == "undefined":
        return True
    if value == "null":
        return True
    return False
