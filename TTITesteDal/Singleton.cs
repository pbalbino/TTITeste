namespace TTITesteDal
{
    public abstract class Singleton<T> where T : class, new()
    {
        #region Private Fields
        
        private readonly static T InstancePrivate = new T();

        #endregion

        #region Properties
        
        public static T Instance
        {
            get { return InstancePrivate; }
        }

        #endregion
    }
}
